import { JWTUser, verifyJWT, VerifyOptions } from "@alanszp/jwt";
import { UnauthorizedError } from "@alanszp/errors";
import { errorView } from "../views/errorView";
import { NextFunction, Response } from "express";
import { getRequestLogger } from "../helpers/getRequestLogger";
import { GenericRequest } from "../types/GenericRequest";
import { Logger } from "@alanszp/logger";

function parseAuthorizationHeader(
  authorization: string | undefined
): string | undefined {
  if (!authorization) return undefined;
  const [bearer, jwt, ...other] = authorization.split(" ");

  if (bearer !== "Bearer" || other.length > 0) return undefined;

  return jwt;
}

enum AuthMethods {
  JWT = "JWT",
  API_KEY = "API_KEY",
}

interface JWTOptions {
  jwtVerifyOptions: VerifyOptions;
  types: [AuthMethods.JWT];
}

interface TokenOptions {
  validTokens: string[];
  types: [AuthMethods.API_KEY];
}

interface BothMethodsOptions {
  jwtVerifyOptions: VerifyOptions;
  validTokens: string[];
  types:
    | [AuthMethods.JWT, AuthMethods.API_KEY]
    | [AuthMethods.API_KEY, AuthMethods.JWT];
}

type AuthOptions = JWTOptions | TokenOptions | BothMethodsOptions;

const middlewareGetterByAuthType = {
  [AuthMethods.JWT]: async (
    publicKey: string,
    jwt: string,
    options: Exclude<AuthOptions, TokenOptions>,
    logger: Logger
  ): Promise<JWTUser | null | undefined> => {
    try {
      if (!jwt) return undefined;
      const jwtUser = await verifyJWT(publicKey, jwt, options.jwtVerifyOptions);
      logger.debug("auth.authWithJwt.authed", {
        user: jwtUser.id,
        org: jwtUser.organizationReference,
      });
      return jwtUser;
    } catch (error: unknown) {
      logger.info("auth.authWithJwt.invalidJwt", { jwt, error });
      return null;
    }
  },
  [AuthMethods.API_KEY]: async (
    _: string,
    token: string,
    options: Exclude<AuthOptions, JWTOptions>,
    logger: Logger
  ): Promise<JWTUser | null | undefined> => {
    try {
      if (!token) return undefined;
      if (options.validTokens.includes(token)) {
        logger.debug("auth.authWithApiKey.authed", {
          user: "0",
          org: "0",
        });
        return Promise.resolve({
          id: "0",
          employeeReference: "0",
          organizationReference: "none",
          roles: [],
          permissions: [],
        });
      } else {
        return null;
      }
    } catch (error: unknown) {
      logger.info("auth.authWithApiKey.invalidApiKey", { token, error });
      return null;
    }
  },
};

export function createAuthContext<Options extends AuthOptions>(
  publicKey: string,
  options: Options
) {
  return function getMiddlewareForMethods(authMethods: Options["types"]) {
    return async function authWithGivenMethods(
      req: GenericRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      const logger = getRequestLogger(req);
      const cookies = (req.cookies as Record<string, string | undefined>) || {};
      const token = parseAuthorizationHeader(req.headers.authorization);
      const jwt = cookies.jwt || token;

      try {
        const authAttempts = authMethods.map((method) =>
          middlewareGetterByAuthType[method](
            publicKey,
            method === AuthMethods.JWT ? jwt : token,
            options,
            logger
          )
        );

        if (authAttempts.every((attempt) => attempt === undefined)) {
          res
            .status(401)
            .json(
              errorView(
                new UnauthorizedError(
                  authMethods.map(
                    (method) => `Token not set for method ${method}`
                  )
                )
              )
            );
          return;
        }

        if (authAttempts.every((attempt) => attempt === null)) {
          res
            .status(401)
            .json(
              errorView(
                new UnauthorizedError(
                  authMethods.map(
                    (method) => `Token invalid for method ${method}`
                  )
                )
              )
            );
          return;
        }

        const jwtUser = authAttempts.find((attempt) => !!attempt);

        req.context.jwtUser = jwtUser;
        req.context.authenticated.push("jwt");

        next();
      } catch (error: unknown) {
        logger.info("auth.authWithJwt.invalidJwt", { jwt, error });
        res.status(401).json(errorView(new UnauthorizedError(authMethods)));
      }
    };
  };
}
