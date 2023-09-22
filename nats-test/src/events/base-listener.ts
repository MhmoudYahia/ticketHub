import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;

  private client: Stan;
  protected ackWait: number = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable() //use setdeliverallavailable that we can get all the events that have been emitted in the past.
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName); //We're going to use setdurablename to make sure that we keep track of all the different events that have gone to this subscription or the SKU group, even if it goes offline for a little bit.
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName, //And then finally, we're going to use this cue group to make sure that we do not accidentally dump the durable name, even if all of our services restart for a very brief period of time, and to make sure that all these emitted events only go off to one instance of our services, even if we are running multiple
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Received message: ${this.subject} / ${this.queueGroupName}`);

      const parsedMessage = this.parseMessage(msg);
      this.onMessage(parsedMessage, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();

    if (typeof data === 'string') {
      return JSON.parse(data);
    } else return JSON.parse(data.toString('utf8'));
  }
}
