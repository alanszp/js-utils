import { IntegrationExecutionResult } from "../IntegrationExecutionResult";
import { BaseIntegrationHistory } from "../models/BaseIntegrationHistory";

export function syncIntegrationHistoryView<IH extends BaseIntegrationHistory>(
  history: IH
): Record<string, unknown> {
  return {
    id: history.id,
    status: history.status,
    executedAt: history.executedAt,
    executedBy: history.executedBy,
    totals: history.result.totals,
    details: history.result.details,
  };
}

export function syncIntegrationResultsView(
  result: IntegrationExecutionResult
): Record<string, unknown> {
  const { totals, details } = result.getResults();
  return {
    totals,
    details,
    status: result.getStatus(),
    context: result.getContext(),
  };
}
