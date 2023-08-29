import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  reason = 'database connection error';
  statusCode = 500;

  constructor() {
    super('error connecting to database');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
