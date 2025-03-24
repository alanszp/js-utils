import { snakeCase } from "lodash";
import { ILogger } from "@alanszp/logger";
import { ConnectionManager } from "../connectionManager";
import {
  JobData,
  Job,
  RawWorker,
  WorkerOptions,
  JobReturnValue,
} from "../types";
import { SharedContext } from "@alanszp/shared-context";
import { Audit } from "@alanszp/audit";
import { withContext } from "../wrappers/withContext";

export interface WorkerStatus {
  running: boolean;
  paused: boolean;
}

export interface WorkerSetup {
  queueName: string;
  workerOptions?: WorkerOptions;
}

export interface WorkerContext {
  sharedContext: SharedContext;
  baseLogger: ILogger;
  audit: Audit;
}

// optional methods

interface Worker<Data = JobData, ReturnValue = JobReturnValue> {
  handleJobFailed?(
    job: Job<Data, ReturnValue>,
    error: Error,
    isLastAttempt: boolean
  ): Promise<void> | void;
  handleJobCompleted?(job: Job<Data, ReturnValue>): Promise<void> | void;
  handleJobError?(error: Error): Promise<void> | void;
}

type QueueName = { name: string; prefix: string; namespace: string };

const BULL_PREFIX = "b";

abstract class Worker<Data = JobData, ReturnValue = unknown> {
  private _worker: RawWorker;

  private _queue: QueueName;

  private getLogger: () => ILogger;

  constructor() {
    const { queueName: name, workerOptions } = this.setup();

    const connectionManager = ConnectionManager.getInstance();
    this.getLogger = connectionManager.getLogger;

    const prefix = connectionManager.getServiceName();
    this._queue = { name, prefix, namespace: BULL_PREFIX };
    this._worker = new RawWorker<Data, ReturnValue>(name, this.processJob(), {
      autorun: false,
      connection: connectionManager.getConnection(),
      prefix: `{${prefix}}:${BULL_PREFIX}`,
      ...workerOptions,
    });
    this.getLogger().info(`worker.ready.${snakeCase(this.queueFullName)}`, {
      queue: this.queueFullName,
    });

    this.registerHooks();
  }

  // Handle job
  abstract process(job: Job<Data, ReturnValue>): Promise<ReturnValue>;

  abstract setup(): WorkerSetup;

  abstract getContext(): WorkerContext;

  public close(): Promise<void> {
    return this.worker.close();
  }

  public get status(): WorkerStatus {
    return { running: this.worker.isRunning(), paused: this.worker.isPaused() };
  }

  public get id(): RawWorker["id"] {
    return this.worker.id;
  }

  private processJob(): (job: Job<Data, ReturnValue>) => Promise<ReturnValue> {
    return withContext(this.queueFullName, this.getContext(), async (job) => {
      this.getLogger().info(
        `worker.process.job_received.${snakeCase(this.queueFullName)}`,
        {
          queue: this.queueFullName,
          job,
        }
      );
      return this.process(job);
    });
  }

  private isLastAttempt(job: Job<Data, ReturnValue>): boolean {
    const maxAttempts = job.opts.attempts;
    if (!maxAttempts) return true;
    return job.attemptsMade >= maxAttempts;
  }

  async processFailed(
    job: Job<Data, ReturnValue>,
    error: Error
  ): Promise<void> {
    const isLastAttempt = this.isLastAttempt(job);
    if (this.handleJobFailed) {
      await this.handleJobFailed(job, error, this.isLastAttempt(job));
    } else {
      if (isLastAttempt) {
        this.getLogger().error(
          `worker.job.failed.${snakeCase(this.queueFullName)}`,
          {
            queue: this.queueFullName,
            job,
            error,
          }
        );
      } else {
        this.getLogger().warn(
          `worker.job.failed.${snakeCase(this.queueFullName)}`,
          {
            queue: this.queueFullName,
            job,
            error,
          }
        );
      }
    }
  }

  async processCompleted(
    job: Job<Data, ReturnValue>,
    returnValue: ReturnValue
  ): Promise<void> {
    this.getLogger().info(
      `worker.job.completed.${snakeCase(this.queueFullName)}`,
      {
        queue: this.queueFullName,
        job,
        returnValue,
      }
    );
    if (this.handleJobCompleted) {
      await this.handleJobCompleted(job);
    }
  }

  async processError(error: Error): Promise<void> {
    if (this.handleJobError) {
      await this.handleJobError(error);
    } else {
      this.getLogger().error(
        `worker.job.unhandled_exception.${snakeCase(this.queueFullName)}`,
        {
          queue: this.queueFullName,
          error,
        }
      );
    }
  }

  async run(): Promise<void> {
    try {
      this.getLogger().info(
        `worker.run.starting.${snakeCase(this.queueFullName)}`,
        {
          queue: this.queueFullName,
        }
      );

      await this.worker.run();
      this.getLogger().info(
        `worker.run.started.${snakeCase(this.queueFullName)}`,
        {
          queue: this.queueFullName,
        }
      );
    } catch (error: unknown) {
      this.getLogger().error(
        `worker.run.error.${snakeCase(this.queueFullName)}`,
        {
          queue: this.queueFullName,
          error,
        }
      );
      throw error;
    }
  }

  protected registerHooks(): void {
    // on error: handle unhandled exceptions
    this.worker.on("error", (error: Error) => this.processError(error));
    // on completed: allow to do something else after a job is completed
    this.worker.on(
      "completed",
      (job: Job<Data, ReturnValue>, result: ReturnValue) =>
        this.processCompleted(job, result)
    );
    // on failed: when the process fails with an exception it is possible to listen for the "failed" event
    this.worker.on("failed", (job: Job<Data, ReturnValue>, error: Error) =>
      this.processFailed(job, error)
    );
  }

  protected get worker(): RawWorker {
    return this._worker;
  }

  get queueFullName(): string {
    const { name, prefix, namespace } = this._queue;
    return `{${prefix}}:${namespace}:${name}`;
  }

  get queueName(): string {
    return this._queue.name;
  }
}

// this export is required for merging optional methods interface into abstract class
export { Worker };
