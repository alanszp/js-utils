import { UnauthorizedError } from "@alanszp/errors";
import { errorView } from "../views/errorView";
import { NextFunction, Request, Response } from "express";
import { getRequestLogger } from "../helpers/getRequestLogger";
import { AuditBody } from "@alanszp/audit";
import { getIp } from "../helpers/getIp";

export type AuditBodyModifier = (
  req: Request,
  res: Response
) => Promise<Partial<AuditBody>> | Partial<AuditBody>;

export function auditLog(
  action: string,
  bodyModifier?: AuditBodyModifier | void
) {
  return async function writeAuditLog(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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
        succeed: res.statusCode >= 200 && res.statusCode < 300,
        ...partialBody,
        action,
      });
      next();
    } catch (error: unknown) {
      req.context.log.error("auditLog.writeLog.error", { action, error });
      next();
    }
  };
}
