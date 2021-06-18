import { NextFunction, Request, Response } from "express";
import _ from "lodash";
import { InternalServerError, UnauthorizedError } from "@alanszp/errors";
import { AuthMethod } from "../types/AuthMethod";
import { errorView } from "../views/errorView";

export function createIsAuthenticatedMiddleware(requiredChecks: AuthMethod[]) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (req.context?.authenticated) {
      if (
        _.intersection(requiredChecks, req.context.authenticated).length > 0
      ) {
        return next();
      }
      res.status(401).json(errorView(new UnauthorizedError(requiredChecks)));
      return Promise.resolve();
    }

    req.context.log.info("is_authenticated_middleware.error.no_context");
    res.status(500).json(errorView(new InternalServerError()));
    return undefined;
  };
}
