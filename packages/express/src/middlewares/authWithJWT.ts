import { verifyJWT, VerifyOptions } from "@alanszp/jwt";
import { UnauthorizedError } from "@alanszp/errors";
import { errorView } from "../views/errorView";
import { NextFunction, Response } from "express";
import { getRequestLogger } from "../helpers/getRequestLogger";
import { GenericRequest } from "../types/GenericRequest";
import { IncomingHttpHeaders } from "http";

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
    req: GenericRequest,
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

    if (eventBridgeRequest(req.headers)) {
      logger.info("Authenticating EventBridge request");
      const validApiKeys = options?.validApiKeys;
      if (!validApiKeys || !options?.validApiKeys.includes(publicKey)) {
        res
          .status(401)
          .json(
            errorView(
              new UnauthorizedError([
                !eventBridgeRequest(req.headers)
                  ? "Request must come from a valid source."
                  : "The API KEY provided is invalid.",
              ])
            )
          );
        return;
      }
      next();
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
function eventBridgeRequest(headers: IncomingHttpHeaders): boolean {
  return headers["user-agent"] === "Amazon/EventBridge/ApiDestinations";
}
