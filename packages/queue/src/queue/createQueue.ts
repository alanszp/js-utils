import { Queue } from "./queue";
import { QueueRepository } from "./queueRepository";
import { ConnectionManager } from "../connectionManager";
import { JobData, QueueOptions } from "../types";

export function createQueue<JobType = JobData>(name: string, queueOptions?: QueueOptions): Queue {
  const connection = ConnectionManager.getInstance().getConnection();
  const queue = new Queue<JobType>(connection, name, ConnectionManager.getInstance().getServiceName(), queueOptions);
  QueueRepository.Instance.registerQueue(queue);
  return queue;
}
