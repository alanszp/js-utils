import { ILogger } from "@alanszp/logger";
import { compact, isEmpty } from "lodash";
import { ConnectionManager } from "../connectionManager";
import { Worker, WorkerStatus } from "./worker";

export type WokerStatusWithId = { status: WorkerStatus } & { id: string };
interface WorkerClass {
  new (): Worker;
}
type QueueWorkerMap = Record<string, WorkerClass>;

export class WorkerRepository {
  private _workers: QueueWorkerMap;

  private _activeWorkers: Worker[];

  private static _instance: WorkerRepository;

  private getLogger: () => ILogger;

  private constructor() {
    this._workers = {};
    this._activeWorkers = [];
    this.getLogger = ConnectionManager.getInstance().getLogger;
  }

  public static get Instance(): WorkerRepository {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new this();
    return this._instance;
  }

  public registerWorker(queueName: string, workerClass: WorkerClass): WorkerRepository {
    Object.assign(this.workers, { [queueName]: workerClass });
    return this;
  }

  getWorkersByQueues(queueNames: string[]): Worker[] {
    if (isEmpty(this.workers)) {
      this.getLogger().warn("worker_repository.queue_worker_map_is_empty");
      return [];
    }

    return compact(
      queueNames.map((queueName: string) => {
        if (this.workers[queueName]) {
          const worker = new this.workers[queueName]();
          // assuming this method is only called in a context for running them
          this._activeWorkers.push(worker);
          return worker;
        }
        this.getLogger().warn("worker_repository.invalid_queue_name", { queueName });
        return null;
      })
    );
  }

  getWorkerStatuses(): WokerStatusWithId[] {
    return this.activeWorkers.map((worker) => ({ id: worker.id, status: worker.status }));
  }

  public getCloseConnections(): Promise<void>[] {
    return this.activeWorkers.map((worker) => worker.close());
  }

  private get workers(): QueueWorkerMap {
    return this._workers;
  }

  private get activeWorkers(): Worker[] {
    return this._activeWorkers;
  }
}
