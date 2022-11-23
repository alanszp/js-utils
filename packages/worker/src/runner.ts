
import { ConnectionManager } from "./connectionManager";
import { Worker } from "./worker/worker";
import { WorkerRepository } from "./worker/workerRepository";

export async function runWorkers(queueNames: string): Promise<void> {
  if (queueNames.length === 0) {
    ConnectionManager.getInstance().getLogger().warn("worker.env.workers_queues_empty");
    return Promise.resolve();
  }

  const queues: string[] = queueNames.replace(/\s/g, "").split(",");
  const workers = WorkerRepository.Instance.getWorkersByQueues(queues);

  await Promise.all(workers.map((worker: Worker) => worker.run()));
}
