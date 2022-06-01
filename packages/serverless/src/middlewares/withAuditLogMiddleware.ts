import { MiddlewareObj } from "@middy/core";
import { SharedContext } from "@alanszp/shared-context";
import { AuditBody } from "@alanszp/audit";

const AUTOMATIC_ACTION_ACTOR_REF = "0";

export function withAuditLogMiddleware<TEvent, TResult>(
  sharedContext: SharedContext,
  customAuditValues?: Partial<AuditBody>
): MiddlewareObj<TEvent, TResult> {
  return {
    after: (_): void => {
      const audit = sharedContext.getAudit();

      audit &&
        audit.log({
          succeed: true,
          actorRef: AUTOMATIC_ACTION_ACTOR_REF,
          ...customAuditValues,
        });
    },
  };
}
