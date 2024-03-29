import { merge } from "lodash";
import {
  IntegrationResultStatus,
  IntegrationStatus,
  IntegrationResultError,
} from "./types";

type ResultDetails = IntegrationResultStatus["details"];
type ResultTotals = IntegrationResultStatus["totals"];

export interface ChangesStatus {
  updated: string[];
  created: string[];
  removed: string[];
  errors: IntegrationResultError[];
}

export class IntegrationExecutionResult {
  private totals: ResultTotals = { added: 0, removed: 0, updated: 0, error: 0 };

  private details: ResultDetails = {
    added: [],
    removed: [],
    updated: [],
    error: [],
  };

  private integrationId: string;

  private organizationReference: string;

  private status: IntegrationStatus;

  private executedBy: string | undefined;

  private context?: Record<string, unknown>;

  constructor(
    integrationId: string,
    organizationReference: string,
    executedBy?: string
  ) {
    this.integrationId = integrationId;
    this.organizationReference = organizationReference;
    this.executedBy = executedBy;
  }

  public setResults(changes: ChangesStatus): void {
    this.setTotals({
      updated: changes.updated.length,
      added: changes.created.length,
      error: changes.errors.length,
      removed: changes.removed.length,
    });

    this.setDetails({
      updated: changes.updated,
      added: changes.created,
      error: changes.errors,
      removed: changes.removed,
    });
  }

  public setContext(context: Record<string, unknown>): void {
    this.context = context;
  }

  public getContext(): Record<string, unknown> | undefined {
    return this.context;
  }

  public getIntegrationId(): string {
    return this.integrationId;
  }

  public getOrganizationReference(): string {
    return this.organizationReference;
  }

  public setStatus(status: IntegrationStatus): void {
    this.status = status;
  }

  public getStatus(): IntegrationStatus {
    return this.status;
  }

  public getExecutedBy(): string | undefined {
    return this.executedBy;
  }

  public getResults(): IntegrationResultStatus {
    return {
      totals: this.totals,
      details: this.details,
    };
  }

  private setTotals(totals: Partial<ResultTotals>): void {
    this.totals = merge(this.totals, totals);
  }

  private setDetails(details: Partial<ResultDetails>): void {
    this.details = merge(this.details, details);
  }
}
