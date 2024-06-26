export interface AuditBody {
  // Who
  actorRef: string; // Real user ID
  impersonatedRef?: string; // Impersonated user ID. If no impersonating, it will be undefined
  orgRef: string; // Org that was accessed
  originalOrgRef: string; // Original org from the real user. If no impersonating, it will be the same as orgRef

  // Where (it can be an array since the request can jump between nodes, and http keeps record of their IPs)
  ip: string | string[];

  // What
  action: string;
  succeed: boolean;
  targetRef?: string;
  metadata?: Metadata;

  // Context
  lid?: string;
  lch?: string;
  cid?: string;
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
