import { InternalServerError } from "@alanszp/errors";
import { AuthMethod } from "../types/AuthMethod";
import { errorView } from "../views/errorView";
import { NextFunction, Request, Response } from "express";

export function createAuthValidator(
  method: AuthMethod,
  validate: (req: Request) => Promise<boolean>
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const valid = await validate(req);
      if (!valid) return next();
      req.context.authenticated.push(method);
      return next();
    } catch (error: unknown) {
      req.context.log.error("auth_validator.internal_error", { error });
      res.status(500).json(errorView(new InternalServerError(error as Error)));
      return undefined;
    }
  };
}
