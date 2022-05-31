import cuid from "cuid";
import { NextFunction, Response } from "express";
import { ILogger } from "@alanszp/logger";
import { Audit } from "@alanszp/audit";
import { appIdentifier } from "../helpers/appIdentifier";
import { GenericRequest } from "../types/GenericRequest";
import { SharedContext } from "@alanszp/shared-context";
import { compact } from "lodash";

export function createContext(
  sharedContext: SharedContext,
  baseLogger: ILogger,
  audit: Audit
) {
  return (req: GenericRequest, _res: Response, next: NextFunction): void => {
    req.context = req.context || {};

    const receivedChain = req.header("x-lifecycle-chain");
    const lifecycleChain = compact([receivedChain, appIdentifier()]).join(",");

    const lifecycleId = req.headers["x-lifecycle-id"]?.toString() || cuid();

    const contextId = cuid();

    sharedContext.run(() => next(), {
      logger: baseLogger,
      audit: audit.withState(),
      lifecycleId,
      lifecycleChain,
      contextId,
    });

    req.context.authenticated = [];
    req.context.lifecycleId = lifecycleId;
    req.context.lifecycleChain = lifecycleChain;
    req.context.contextId = contextId;
    req.context.log = sharedContext.getLogger() || baseLogger;
    req.context.audit = sharedContext.getAudit() || audit.withState();
  };
}
