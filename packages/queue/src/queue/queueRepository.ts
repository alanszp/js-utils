import { Queue } from "./queue";

export class QueueRepository {
  private _queues: Queue[];

  private static _instance: QueueRepository;

  private constructor() {
    this._queues = [];
  }

  public static get Instance(): QueueRepository {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new this();
    return this._instance;
  }

  public registerQueue(queue: Queue) {
    this._queues.push(queue);
  }

  public getCloseConnections(): Promise<void>[] {
    return this._queues.map((q) => q.close());
  }
}
