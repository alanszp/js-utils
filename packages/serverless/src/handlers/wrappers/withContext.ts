import { ILogger } from "@alanszp/logger";
import { Audit } from "@alanszp/audit";
import { SharedContext } from "@alanszp/shared-context";

export type Lambda<TEvent, TContext, TResult> = (
  event: TEvent,
  context: TContext
) => TResult;

export function withContext<TEvent, TContext, TResult>(
  handler: Lambda<TEvent, TContext, TResult>,
  sharedContext: SharedContext,
  baseLogger: ILogger,
  audit: Audit,
  lifecycleId: string,
  lifecycleChain: string,
  contextId: string
): Lambda<TEvent, TContext, TResult> {
  return (event, context) =>
    sharedContext.run(
      () => handler(event, context),
      baseLogger,
      audit,
      lifecycleId,
      lifecycleChain,
      contextId
    );
}
