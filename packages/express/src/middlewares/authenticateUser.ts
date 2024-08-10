import { JWTUser, verifyJWT, VerifyOptions } from "@alanszp/jwt";
import { NextFunction, Response } from "express";
import { parse as parseCookie } from "cookie";
import { getRequestLogger } from "../helpers/getRequestLogger";
import { GenericRequest } from "../types/GenericRequest";
import { ILogger } from "@alanszp/logger";
import { compact, isEmpty, omit, reduce } from "lodash";
import { AuthenticationMethodError } from "../errors/AuthMethodFailureError";
import { render401Error } from "../helpers/renderErrorJson";

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

export enum JwtCookiesKeys {
  USER_ACCESS = "jwt",
  IMPERSONATED_ACCESS = "impersonatedJwt",
  PARTIAL_LOGIN_ACCESS = "partialAccessJwt",
}

export interface JWTVerifyOptions extends Partial<VerifyOptions> {
  publicKey: string;
}

export interface JWTOptions {
  jwtVerifyOptions: JWTVerifyOptions;
  types: [AuthMethods.JWT];
  cookiesKeys?: string[];
}

export interface ApiKeyOptions {
  validApiKeys: string[];
  types: [AuthMethods.API_KEY];
}

export interface BothMethodsOptions {
  jwtVerifyOptions: JWTVerifyOptions;
  cookiesKeys?: string[];
  validApiKeys: string[];
  types:
    | [AuthMethods.JWT, AuthMethods.API_KEY]
    | [AuthMethods.API_KEY, AuthMethods.JWT];
}

export type AuthOptions = JWTOptions | ApiKeyOptions | BothMethodsOptions;

const middlewareGetterByAuthType: Record<
  AuthMethods,
  (
    tokenOrJwt: GenericRequest,
    options: AuthOptions,
    logger: ILogger
  ) => Promise<JWTUser | null | undefined>
> = {
  [AuthMethods.JWT]: async (
    req: GenericRequest,
    options: Exclude<AuthOptions, ApiKeyOptions>,
    logger: ILogger
  ) => {
    try {
      const cookiesKeys = options.cookiesKeys || [
        JwtCookiesKeys.IMPERSONATED_ACCESS,
        JwtCookiesKeys.USER_ACCESS,
      ];
      const cookies = parseCookie(req.headers?.cookie ?? "");

      const jwtFromCookies = reduce(
        cookiesKeys,
        (acc, key) => acc ?? cookies[key],
        null
      );
      const jwt =
        jwtFromCookies ?? parseAuthorizationHeader(req.headers.authorization);

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
      logger.info("auth.authWithJwt.invalidJwt", { error });
      return null;
    }
  },
  [AuthMethods.API_KEY]: async (
    req: GenericRequest,
    options: Exclude<AuthOptions, JWTOptions>,
    logger: ILogger
  ): Promise<JWTUser | null | undefined> => {
    const token = req.headers?.authorization;
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
            roleReferences: [],
            segmentReference: null,
            // This will be changed in the near future to grab all permissions.
            permissions: "MA==", // 0 in base64
          })
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
  options: Options
) {
  return function getMiddlewareForMethods(
    authMethods: Options["types"][number][]
  ) {
    return async function authWithGivenMethods(
      req: GenericRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        await tsoaAuthProvider(req, options, authMethods);
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

/**
 * Attempt to authenticate a user using the authentication methods sent by parameter
 * Used in authenticationModule for TSOA
 * https://tsoa-community.github.io/docs/authentication.html
 */
export async function tsoaAuthProvider<Options extends AuthOptions>(
  req: GenericRequest,
  options: Options,
  authMethods: AuthMethods[]
): Promise<JWTUser> {
  const logger = getRequestLogger(req);

  try {
    const authAttempts = await Promise.all(
      authMethods.map((method) =>
        middlewareGetterByAuthType[method](req, options, logger)
      )
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
      jwtUser.employeeReference !== "0" ? "jwt" : "api_key"
    );
    return jwtUser;
  } catch (error: unknown) {
    if (error instanceof AuthenticationMethodError) {
      logger.info("auth.authenticate_with_methods.authentication_user_fail", {
        methods: authMethods,
        error,
      });
      throw error;
    }
    logger.error("auth.authenticate_with_methods.error", {
      error,
      authMethods,
    });
    throw new AuthenticationMethodError(authMethods);
  }
}
