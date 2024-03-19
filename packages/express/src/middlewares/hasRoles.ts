import { NextFunction, Response } from "express";
import { GenericRequest } from "../types/GenericRequest";
import { render403Error } from "../helpers/renderErrorJson";

function response403(res: Response): void {
  res.status(403).json(render403Error());
}

export function hasRoles(
  roles: string | string[]
): (req: GenericRequest, res: Response, next: NextFunction) => void {
  return (req: GenericRequest, res: Response, next: NextFunction) => {
    const { jwtUser } = req.context;
    if (!jwtUser) {
      return response403(res);
    }

    if (jwtUser.hasRoles(roles)) {
      return next();
    }

    response403(res);
  };
}
