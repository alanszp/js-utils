import { isArray } from "lodash";
import { ConnectionManager } from "./connectionManager";
import { QueueManager } from "./queue/QueueManager";
import { BaseQueue } from "./queue/baseQueue";
import { WorkerRepository } from "./worker/workerRepository";

export async function shutdownQueue<
  EnumKey extends string | number | symbol,
  EnumValue extends string,
  QueueType extends BaseQueue
>(
  queueManagers:
    | QueueManager<EnumKey, EnumValue, QueueType>
    | QueueManager<EnumKey, EnumValue, QueueType>[]
): Promise<void> {
  const queueManagersArray = isArray(queueManagers)
    ? queueManagers
    : [queueManagers];

  await Promise.all([
    ...WorkerRepository.Instance.getCloseConnections(),
    ...queueManagersArray.map((q) => q.disconnectAll()),
  ]);

  ConnectionManager.getInstance().close();
}
