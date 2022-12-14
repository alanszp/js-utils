export enum IntegrationStatus {
  SUCCESS = "success",
  ERROR = "error",
}

export enum SyncError {
  MISSING_FIELDS = "missing",
  VALIDATION = "validation",
  VALIDATION_SERVER = "validation_server",
  CREATION_DISABLED = "creation_disabled",
}

export type IntegrationResultError = {
  type: SyncError;
  userReference: string;
  metadata: string[];
};

export interface IntegrationResultStatus {
  totals: {
    added: number;
    updated: number;
    removed: number;
    error: number;
  };
  details: {
    added: string[];
    updated: string[];
    removed: string[];
    error: IntegrationResultError[];
  };
}
