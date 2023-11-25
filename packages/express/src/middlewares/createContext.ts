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
  return (req: GenericRequest, res: Response, next: NextFunction): void => {
    req.context = req.context || {};

    const receivedChain =
      req.header("x-lifecycle-chain") || req.body?.detail?.lch;
    const lifecycleChain = compact([receivedChain, appIdentifier()]).join(",");

    const lifecycleId =
      req.header("x-lifecycle-id") || req.body?.detail?.lid || cuid();

    const contextId = cuid();

    res.setHeader("x-lifecycle-id", lifecycleId);
    res.setHeader("x-context-id", contextId);

    sharedContext.run(
      (context) => {
        req.context.authenticated = [];
        req.context.lifecycleId = context.lifecycleId;
        req.context.lifecycleChain = context.lifecycleChain;
        req.context.contextId = context.contextId;
        req.context.log = context.logger;
        req.context.audit = context.audit;
        next();
      },
      {
        logger: baseLogger,
        audit: audit.withState(),
        lifecycleId,
        lifecycleChain,
        contextId,
      }
    );
  };
}
