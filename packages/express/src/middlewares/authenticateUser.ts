import { JWTUser, verifyJWT, VerifyOptions } from "@alanszp/jwt";
import { UnauthorizedError } from "@alanszp/errors";
import { errorView } from "../views/errorView";
import { NextFunction, Response } from "express";
import { getRequestLogger } from "../helpers/getRequestLogger";
import { GenericRequest } from "../types/GenericRequest";
import { Logger } from "@alanszp/logger";
import { compact, isEmpty, omit } from "lodash";

function parseAuthorizationHeader(
  authorization: string | undefined
): string | undefined {
  if (!authorization) return undefined;
  const [bearer, jwt, ...other] = authorization.split(" ");

  if (bearer !== "Bearer" || other.length > 0) return undefined;

  return jwt;
}

export enum AuthMethods {
  JWT = "JWT",
  API_KEY = "API_KEY",
}

export interface JWTVerifyOptions extends VerifyOptions {
  publicKey: string;
}

export interface JWTOptions {
  jwtVerifyOptions: JWTVerifyOptions;
  types: [AuthMethods.JWT];
}

export interface ApiKeyOptions {
  validApiKeys: string[];
  types: [AuthMethods.API_KEY];
}

export interface BothMethodsOptions {
  jwtVerifyOptions: JWTVerifyOptions;
  validApiKeys: string[];
  types:
    | [AuthMethods.JWT, AuthMethods.API_KEY]
    | [AuthMethods.API_KEY, AuthMethods.JWT];
}

export type AuthOptions = JWTOptions | ApiKeyOptions | BothMethodsOptions;

const middlewareGetterByAuthType = {
  [AuthMethods.JWT]: async (
    jwt: string,
    options: Exclude<AuthOptions, ApiKeyOptions>,
    logger: Logger
  ): Promise<JWTUser | null | undefined> => {
    try {
      if (!jwt) return undefined;
      const jwtUser = await verifyJWT(
        options.jwtVerifyOptions.publicKey,
        jwt,
        omit(options.jwtVerifyOptions, "publicKey")
      );
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
    token: string,
    options: Exclude<AuthOptions, JWTOptions>,
    logger: Logger
  ): Promise<JWTUser | null | undefined> => {
    try {
      if (!token) return undefined;
      if (options.validApiKeys.includes(token)) {
        logger.debug("auth.authWithApiKey.authed", {
          user: "0",
          org: "lara",
        });
        return Promise.resolve({
          id: "0",
          employeeReference: "0",
          organizationReference: "lara",
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
      const jwt =
        cookies.jwt || parseAuthorizationHeader(req.headers.authorization);

      try {
        const authAttempts = await Promise.all(
          authMethods.map((method) =>
            middlewareGetterByAuthType[method](
              method === AuthMethods.JWT ? jwt : req.headers.authorization,
              options,
              logger
            )
          )
        );

        const successfulAuthAttempts = compact(authAttempts);

        if (isEmpty(successfulAuthAttempts)) {
          res
            .status(401)
            .json(
              errorView(
                new UnauthorizedError([
                  authAttempts.includes(null)
                    ? `Token invalid for methods ${authMethods}`
                    : `Token not set for methods ${authMethods}`,
                ])
              )
            );
          return;
        }

        const jwtUser: JWTUser = successfulAuthAttempts[0];
        req.context.jwtUser = jwtUser;
        req.context.authenticated.push(
          jwtUser.employeeReference !== "0" ? "jwt" : "api_key"
        );
        next();
      } catch (error: unknown) {
        logger.info("auth.authenticateUser.error", {
          jwt,
          token: req.headers.authorization,
          methods: AuthMethods,
          error,
        });
        res.status(401).json(errorView(new UnauthorizedError(authMethods)));
      }
    };
  };
}
