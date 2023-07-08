import { LogStatus } from './log-staus';

export class LogRecord {
  private date: Date;

  constructor(private status: LogStatus, private value: string) {
    this.date = new Date();
  }

  toString() {
    return `${this.date.toLocaleTimeString()} [${this.status}]: ${this.value}`;
  }
}
