import { UnauthorizedError } from "@alanszp/errors";
import { errorView } from "../views/errorView";
import { NextFunction, Request, Response } from "express";
import { jwtUserHasRoles } from "../../../jwt/dist";

function response401(res: Response): void {
  res.status(401).json(errorView(new UnauthorizedError(["permissions"])));
}

export function hasRoles(
  roles: string | string[]
): (req: Request<unknown>, res: Response, next: NextFunction) => void {
  return (req: Request<unknown>, res: Response, next: NextFunction) => {
    const { jwtUser } = req.context;
    if (!jwtUser) {
      return response401(res);
    }

    if (jwtUserHasRoles(jwtUser, roles)) {
      return next();
    }

    response401(res);
  };
}
