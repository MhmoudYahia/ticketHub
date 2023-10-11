import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Can not access NATS client before connecting');
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((res, rej) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        res();
      });

      this.client.on('error', (err) => {
        rej(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
