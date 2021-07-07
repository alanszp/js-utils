import { verifyJWT, VerifyOptions } from "@alanszp/jwt";
import { UnauthorizedError } from "@alanszp/errors";
import { errorView } from "@alanszp/express";
import { NextFunction, Request, Response } from "express";
import { getRequestLogger } from "../helpers/getRequestLogger";

function parseAuthorizationHeader(
  authorization: string | undefined
): string | undefined {
  if (!authorization) return undefined;
  const [bearer, jwt, ...other] = authorization.split(" ");

  if (bearer !== "Bearer" || other.length > 0) return undefined;

  return jwt;
}

export function createAuthWithJWT(publicKey: string, options?: VerifyOptions) {
  return async function authWithJwt(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const logger = getRequestLogger(req);
    const cookies = (req.cookies as Record<string, string | undefined>) || {};
    const jwt =
      cookies.jwt || parseAuthorizationHeader(req.headers.authorization);

    if (!jwt) {
      logger.debug("auth.authWithJwt.error.notPresent", {
        headers: req.headers,
      });
      res.status(401).json(errorView(new UnauthorizedError(["jwt"])));
      return;
    }

    try {
      const jwtUser = await verifyJWT(publicKey, jwt, options);
      logger.debug("auth.authWithJwt.authed", {
        user: jwtUser.id,
        org: jwtUser.organizationReference,
      });

      req.context.jwtUser = jwtUser;
      req.context.authenticated.push("jwt");

      next();
    } catch (error: unknown) {
      logger.info("auth.authWithJwt.invalidJwt", { jwt, error });
      res.status(401).json(errorView(new UnauthorizedError(["jwt"])));
    }
  };
}
