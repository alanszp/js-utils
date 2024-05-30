import { ConnectionManager } from "./connectionManager";
import { QueueRepository } from "./queue/QueueRepository";
import { BaseQueue } from "./queue/baseQueue";
import { WorkerRepository } from "./worker/workerRepository";

export async function shutdownQueue<
  EnumKey extends string | number | symbol,
  EnumValue extends string,
  QueueType extends BaseQueue
>(
  queueManagers: QueueRepository<EnumKey, EnumValue, QueueType>[]
): Promise<void> {
  await Promise.all([
    ...WorkerRepository.Instance.getCloseConnections(),
    ...queueManagers.map((q) => q.disconnectAll()),
  ]);

  ConnectionManager.getInstance().close();
}
