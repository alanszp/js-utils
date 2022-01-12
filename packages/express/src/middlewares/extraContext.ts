import cuid from "cuid";
import { NextFunction, Request, Response } from "express";
import { ILogger } from "@alanszp/logger";
import { Audit } from "@alanszp/audit";
import { AsyncLocalStorage } from "async_hooks";
import { appIdentifier } from "../helpers/appIdentifier";
import { AuditWithState } from "@alanszp/audit/dist/auditWithState";

export interface RequestSharedContext {
  audit: AuditWithState;
  logger: ILogger;
  lifecycleId: string;
  lifecycleChain: string;
}

export function createExtraContext(baseLogger: ILogger, audit: Audit) {
  const requestSharedContext = new AsyncLocalStorage<RequestSharedContext>();
  return {
    requestSharedContext,
    extraContext: function extraContext(
      req: Request<any>,
      _res: Response,
      next: NextFunction
    ): void {
      req.context = req.context || {};

      const receivedChain = req.header("x-lifecycle-chain");
      const separator = receivedChain ? "," : "";
      const lifecycleChain = `${
        receivedChain || ""
      }${separator}${appIdentifier()}`;
      const lifecycleId = req.headers["x-lifecycle-id"]?.toString() || cuid();

      const logger = baseLogger.child({
        lid: lifecycleId,
        lch: lifecycleChain,
      });

      const auditWithState = audit.withState();

      req.context.authenticated = [];
      req.context.lifecycleId = lifecycleId;
      req.context.lifecycleChain = lifecycleChain;
      req.context.log = logger;
      req.context.audit = auditWithState;

      requestSharedContext.run(
        {
          audit: auditWithState,
          logger,
          lifecycleId,
          lifecycleChain,
        },
        () => next()
      );
    },
  };
}
