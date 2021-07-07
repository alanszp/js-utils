import { NotFoundError, UnauthorizedError } from "@alanszp/errors";
import { errorView } from "../views/errorView";
import { NextFunction, Request, Response } from "express";
import { getRequestLogger } from "../helpers/getRequestLogger";

function response401(res: Response): void {
  res.status(401).json(new UnauthorizedError(["jwt"]));
}

export function authForOrg(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { orgReference } = req.params;
  const logger = getRequestLogger(req).child({ org: orgReference });
  try {
    if (!orgReference) {
      logger.error("middleware.authForOrg.error.noOrgReferenceInPath");
      return response401(res);
    }

    if (!req.context?.jwtUser?.organizationReference) {
      logger.info("middleware.authForOrg.error.noOrgInJwt", {
        jwtUser: req.context?.jwtUser || null,
      });
      return response401(res);
    }

    if (req.context.jwtUser.organizationReference !== orgReference) {
      logger.info("middleware.authForOrg.error.nonMatch", {
        jwtOrg: req.context.jwtUser.organizationReference,
      });
      return response401(res);
    }

    return next();
  } catch (error: unknown) {
    logger.info("middleware.authForOrg.error.noOrganization", {
      error,
    });
    res.status(404).json(errorView(new NotFoundError()));
  }
}
