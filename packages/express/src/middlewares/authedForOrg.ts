import { NextFunction, Response } from "express";
import { getRequestLogger } from "../helpers/getRequestLogger";
import { GenericRequest } from "../types/GenericRequest";
import { render401Error, render404Error } from "../helpers/renderErrorJson";

function response401(res: Response): void {
  res.status(401).json(render401Error(["jwt"]));
}

export function authForOrg(
  req: GenericRequest,
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

    const jwtOrg = req.context.jwtUser.organizationReference;
    if (jwtOrg !== orgReference) {
      if (jwtOrg === "lara") {
        req.context.jwtUser.organizationReference = orgReference;
        return next();
      }

      logger.info("middleware.authForOrg.error.nonMatch", {
        jwtOrg,
      });
      return response401(res);
    }

    return next();
  } catch (error: unknown) {
    logger.info("middleware.authForOrg.error.noOrganization", {
      error,
    });
    res.status(404).json(render404Error());
  }
}
