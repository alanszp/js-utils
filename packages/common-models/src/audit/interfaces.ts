export interface AuditBody {
  // Who
  actorRef: string;
  orgRef: string;

  // Where (it can be an array since the request can jump between nodes, and http keeps record of their IPs)
  ip: string | string[];

  // What
  action: string;
  succeed: boolean;
  targetRef?: string;
  metadata?: Metadata;
}

export enum CommonMetadataKeys {
  EMPLOYEE_ID = "employee_id",
  EMPLOYEE_IDS = "employee_ids",
  CHANGES = "changes",
  QUERY = "query",
}

export interface Metadata {
  [key: string]: unknown;
}

export const REQUIRED_FIELDS = [
  "actorRef",
  "orgRef",
  "ip",
  "action",
  "succeed",
];
