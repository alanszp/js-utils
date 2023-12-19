import { Queue } from "./queue";
import { QueueRepository } from "./queueRepository";
import { ConnectionManager } from "../connectionManager";
import { JobData, QueueOptions } from "../types";
import { SharedContext } from "@alanszp/shared-context";

export function createQueue<Data = JobData>(
  name: string,
  getContext: () => SharedContext,
  queueOptions?: QueueOptions
): Queue<Data> {
  const connection = ConnectionManager.getInstance().getConnection();
  const queue = new Queue<Data>(
    connection,
    name,
    ConnectionManager.getInstance().getServiceName(),
    getContext,
    queueOptions
  );
  QueueRepository.Instance.registerQueue(queue);
  return queue;
}
