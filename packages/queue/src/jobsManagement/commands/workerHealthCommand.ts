import {
  WorkerStatusWithId,
  WorkerRepository,
} from "../../worker/workerRepository";

export function workerHealthCommand(): WorkerStatusWithId[] {
  const statuses = WorkerRepository.Instance.getWorkerStatuses();

  return statuses;
}
