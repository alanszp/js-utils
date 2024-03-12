import { NextFunction, Response } from "express";
import { GenericRequest } from "../types/GenericRequest";
import { render401Error } from "../helpers/renderErrorJson";

function response401(res: Response): void {
  res.status(401).json(render401Error(["permissions"]));
}

export function hasRoles(
  roles: string | string[]
): (req: GenericRequest, res: Response, next: NextFunction) => void {
  return (req: GenericRequest, res: Response, next: NextFunction) => {
    const { jwtUser } = req.context;
    if (!jwtUser) {
      return response401(res);
    }

    if (jwtUser.hasRoles(roles)) {
      return next();
    }

    response401(res);
  };
}
