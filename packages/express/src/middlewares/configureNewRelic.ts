import { NextFunction, Response } from "express";
import newrelic from "newrelic";
import { GenericRequest } from "../types/GenericRequest";

export function configureNewRelic(
  req: GenericRequest,
  _res: Response,
  next: NextFunction
): void {
  newrelic.addCustomAttributes({
    lch: req.context.lifecycleChain,
    lid: req.context.lifecycleId,
    cid: req.context.contextId,
  });

  return next();
}
