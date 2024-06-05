import { ILogger } from "@alanszp/logger";
import { SharedContext } from "@alanszp/shared-context";
import { RedisOptions } from "ioredis";
import { ConnectionManager } from "../connectionManager";
import { BaseQueue } from "./baseQueue";

export class QueueManager<
  EnumKey extends string | number | symbol,
  EnumValue extends string,
  QueueType extends BaseQueue
> {
  private instancedQueues: Map<EnumValue, QueueType>;

  private queueNames: EnumValue[];

  constructor(
    private serviceNameAsPrefix: () => string,
    private redisConfig: () => RedisOptions,
    private getLogger: () => ILogger,
    private getContext: () => SharedContext,
    private queueCreator: (
      queueName: EnumValue,
      getContext: () => SharedContext
    ) => QueueType,
    queueNamesEnum: { [key in EnumKey]: EnumValue }
  ) {
    this.instancedQueues = new Map();
    this.queueNames = Object.values(queueNamesEnum);
  }

  connectAll(): Promise<void> {
    const connManager = ConnectionManager.getInstance();
    connManager.setConfiguration(
      this.redisConfig(),
      this.serviceNameAsPrefix(),
      this.getLogger
    );

    const connectionReady = new Promise<void>((resolve) => {
      connManager.getConnection().on("ready", () => {
        resolve();
      });
    });

    this.queueNames.forEach((queueName) => {
      if (this.instancedQueues.has(queueName)) return;

      this.instancedQueues.set(
        queueName,
        this.queueCreator(queueName, this.getContext)
      );
    });

    return connectionReady;
  }

  disconnectAll(): Promise<void[]> {
    return Promise.all(
      [...this.instancedQueues.values()].map((q) => q.close())
    );
  }

  get(queueName: EnumValue): QueueType {
    const q = this.instancedQueues.get(queueName);
    if (!q) throw new Error("Queue not initialized");
    return q;
  }

  overrideQueue(
    queueName: EnumValue,
    queue: QueueType | Omit<QueueType, "_queue">
  ): void {
    this.instancedQueues.set(queueName, queue as QueueType);
  }

  clearQueues(): void {
    this.instancedQueues.clear();
  }
}
