import { MiddlewareObj } from "@middy/core";
import { BaseQueue, QueueManager, shutdownQueue } from "@alanszp/queue";
import { isArray } from "lodash";

export function initializeQueuesMiddleware<
  TEvent,
  TResult,
  EnumKey extends string | number | symbol,
  EnumValue extends string,
  QueueType extends BaseQueue
>(
  queueManagers:
    | QueueManager<EnumKey, EnumValue, QueueType>
    | QueueManager<EnumKey, EnumValue, QueueType>[]
): MiddlewareObj<TEvent, TResult> {
  return {
    before: async (): Promise<void> => {
      const queueManagersArray = isArray(queueManagers)
        ? queueManagers
        : [queueManagers];

      await Promise.all(queueManagersArray.map((q) => q.connectAll()));
    },
    after: async (): Promise<void> => {
      await shutdownQueue(queueManagers);
    },
  };
}
