import { QueueRepository } from "./queue/queueRepository";
import { ConnectionManager } from "./connectionManager";
import { WorkerRepository } from "./worker/workerRepository";

export async function shutdownQueue(): Promise<void> {
  await Promise.all([
    ...WorkerRepository.Instance.getCloseConnections(),
    ...QueueRepository.Instance.getCloseConnections(),
  ]);

  ConnectionManager.getInstance().close();
}
