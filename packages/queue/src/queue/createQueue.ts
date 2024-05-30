import { Queue } from "./queue";
import { ConnectionManager } from "../connectionManager";
import { JobData, QueueOptions } from "../types";
import { SharedContext } from "@alanszp/shared-context";
import { RepeatableQueue } from "./repeatableQueue";

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
  return queue;
}

export function createRepeatableQueue<Data = JobData>(
  name: string,
  getContext: () => SharedContext,
  queueOptions?: QueueOptions
): RepeatableQueue<Data> {
  const connection = ConnectionManager.getInstance().getConnection();
  const queue = new RepeatableQueue<Data>(
    connection,
    name,
    ConnectionManager.getInstance().getServiceName(),
    getContext,
    queueOptions
  );
  return queue;
}
