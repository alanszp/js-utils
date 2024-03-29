import { NextFunction, Response, Request } from "express";
import { AuditBody } from "@alanszp/audit";
import { getIp } from "../helpers/getIp";
import { GenericRequest } from "../types/GenericRequest";

export type AuditBodyModifier = (
  req: Request<Record<string, string>, unknown, unknown>,
  res: Response
) => Promise<Partial<AuditBody>> | Partial<AuditBody>;

/**
 * Configures the audit log to execute AFTER the response is sent.
 */
export function auditLog(action: string, bodyModifier?: AuditBodyModifier) {
  return function writeAuditLogMiddleware(
    req: GenericRequest,
    res: Response,
    next: NextFunction
  ): void {
    res.on("finish", async function writeAuditLog() {
      try {
        const audit = req.context.audit;

        const partialBody = bodyModifier
          ? await Promise.resolve(bodyModifier(req, res))
          : ({} as Partial<AuditBody>);

        if (req.context.jwtUser) {
          partialBody.orgRef = req.context.jwtUser.organizationReference;
          partialBody.actorRef = req.context.jwtUser.id;
        }

        partialBody.ip = getIp(req) || "no-ip";

        audit.log({
          succeed:
            res.statusCode === 304 ||
            (res.statusCode >= 200 && res.statusCode < 300),
          ...partialBody,
          lid: req.context.lifecycleId ?? undefined,
          lch: req.context.lifecycleChain ?? undefined,
          cid: req.context.contextId ?? undefined,
          action,
        });
      } catch (error: unknown) {
        req.context.log.error("auditLog.writeLog.error", { action, error });
      }
    });

    next();
  };
}
