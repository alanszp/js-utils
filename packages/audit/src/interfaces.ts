export enum CommonMetadataKeys {
  EMPLOYEE_ID = "employee_id",
  EMPLOYEE_IDS = "employee_ids",
  CHANGES = "changes",
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

// When will be set by logger (log time)
// Where will be set by logger (host name)

// Articles that we based to create this:
// https://workos.com/blog/the-developers-guide-to-audit-logs-siem
// https://www.strongdm.com/blog/audit-log-review-management
