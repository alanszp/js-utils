import cuid from "cuid";
import { NextFunction, Response } from "express";
import { ILogger, Audit } from "@alanszp/common-models";
import { appIdentifier } from "../helpers/appIdentifier";
import { AuditWithState } from "@alanszp/common-models";
import { GenericRequest } from "../types/GenericRequest";
import { SharedContext } from "@alanszp/shared-context";

export interface RequestSharedContext {
  audit: AuditWithState;
  logger: ILogger;
  lifecycleId: string;
  lifecycleChain: string;
}

export function createContext(baseLogger: ILogger, audit: Audit) {
  const sharedContext = new SharedContext(cuid(), appIdentifier());
  return {
    sharedContext,
    createContextMiddleware: function createContextMiddleware(
      req: GenericRequest,
      _res: Response,
      next: NextFunction
    ): void {
      req.context = req.context || {};

      const lifecycleChain = req.header("x-lifecycle-chain");
      const lifecycleId = req.headers["x-lifecycle-id"]?.toString();

      sharedContext.run(
        () => next(),
        baseLogger,
        audit,
        lifecycleId,
        lifecycleChain
      );

      req.context.authenticated = [];
      req.context.lifecycleId = sharedContext.getLifecycleId();
      req.context.lifecycleChain = sharedContext.getLifecycleChain();
      req.context.log = sharedContext.getLogger();
      req.context.audit = sharedContext.getAudit();
    },
  };
}
