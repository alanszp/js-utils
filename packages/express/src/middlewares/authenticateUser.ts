import { JWTUser, verifyJWT, VerifyOptions } from "@alanszp/jwt";
import { NextFunction, Response } from "express";
import { getRequestLogger } from "../helpers/getRequestLogger";
import { GenericRequest } from "../types/GenericRequest";
import { ILogger } from "@alanszp/logger";
import { compact, isEmpty, omit } from "lodash";
import { AuthenticationMethodError } from "../errors/AuthMethodFailureError";
import { render401Error } from "../helpers/renderErrorJson";

function parseAuthorizationHeader(
  authorization: string | undefined,
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

export interface JWTVerifyOptions extends Partial<VerifyOptions> {
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

const middlewareGetterByAuthType: Record<
  AuthMethods,
  (
    tokenOrJwt: string | null | undefined,
    options: AuthOptions,
    logger: ILogger,
  ) => Promise<JWTUser | null | undefined>
> = {
  [AuthMethods.JWT]: async (
    jwt: string | null | undefined,
    options: Exclude<AuthOptions, ApiKeyOptions>,
    logger: ILogger,
  ) => {
    try {
      if (!jwt) return undefined;
      const jwtUser = await verifyJWT(
        options.jwtVerifyOptions.publicKey,
        jwt,
        omit(options.jwtVerifyOptions, "publicKey"),
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
    token: string | null | undefined,
    options: Exclude<AuthOptions, JWTOptions>,
    logger: ILogger,
  ): Promise<JWTUser | null | undefined> => {
    try {
      if (!token) return undefined;
      if (options.validApiKeys.includes(token)) {
        logger.debug("auth.authWithApiKey.authed", {
          user: "0",
          org: "lara",
        });
        return Promise.resolve(
          new JWTUser({
            id: "0",
            employeeReference: "0",
            organizationReference: "lara",
            roles: [],
            segmentReference: null,
            // This will be changed in the near future to grab all permissions.
            permissions: "MA==", // 0 in base64
          }),
        );
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
  options: Options,
) {
  return function getMiddlewareForMethods(
    authMethods: Options["types"][number][],
  ) {
    return async function authWithGivenMethods(
      req: GenericRequest,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        await authProvidersMiddleware(req, options, authMethods);
        next();
      } catch (error: unknown) {
        if (error instanceof AuthenticationMethodError) {
          res
            .status(error.httpCode())
            .json(render401Error(error.requiredChecks));
          return;
        }
        res.status(401).json(render401Error(authMethods));
      }
    };
  };
}

async function authProvidersMiddleware<Options extends AuthOptions>(
  req: GenericRequest,
  options: Options,
  authMethods: AuthMethods[],
): Promise<JWTUser> {
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
          logger,
        ),
      ),
    );

    const successfulAuthAttempts = compact(authAttempts);

    if (isEmpty(successfulAuthAttempts)) {
      throw new AuthenticationMethodError([
        authAttempts.includes(null)
          ? `Token invalid for methods ${authMethods}`
          : `Token not set for methods ${authMethods}`,
      ]);
    }

    const jwtUser: JWTUser = successfulAuthAttempts[0];
    req.context.jwtUser = jwtUser;
    req.context.authenticated.push(
      jwtUser.employeeReference !== "0" ? "jwt" : "api_key",
    );
    return jwtUser;
  } catch (error: unknown) {
    logger.info("auth.authenticateUser.error", {
      jwt,
      token: req.headers.authorization,
      methods: AuthMethods,
      error,
    });
    throw error;
  }
}
