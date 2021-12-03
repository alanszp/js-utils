import { createPublicKey, createPrivateKey, KeyObject } from "crypto";
import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";
import type { JWTPayload, JWTUser, SignOptions, VerifyOptions } from "./types";

export const JWT_ALGORITHM = "RS512";

export function privateKeyFromPem(key: string): KeyObject {
  return createPrivateKey({
    key,
    format: "pem",
  });
}

export function publicKeyFromPem(key: string): KeyObject {
  return createPublicKey({
    key,
    format: "pem",
  });
}

export function withDefaultSignOptions(
  options?: Partial<SignOptions>
): SignOptions {
  return {
    issuer: "hodor",
    audience: "web",
    expiration: "24h",
    ...options,
  };
}

export function withDefaultVerifyOptions(
  options?: Partial<VerifyOptions>
): VerifyOptions {
  return {
    issuer: ["hodor", "long:1"],
    audience: "web",
    ...options,
  };
}

export async function generateJWT(
  privateKey: KeyObject | string,
  user: JWTUser,
  options?: Partial<SignOptions>
): Promise<string> {
  const key =
    typeof privateKey === "string" ? privateKeyFromPem(privateKey) : privateKey;

  const opts = withDefaultSignOptions(options);

  return new SignJWT(createTokenPayload(user))
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setIssuer(opts.issuer)
    .setAudience(opts.audience)
    .setExpirationTime(opts.expiration)
    .sign(key);
}

export function createTokenPayload(user: JWTUser): JWTPayload {
  return {
    sub: user.id,
    ref: user.employeeReference,
    org: user.organizationReference,
    rls: user.roles,
    prms: user.permissions,
  };
}

export async function verifyJWT(
  publicKey: KeyObject | string,
  token: string,
  options?: Partial<VerifyOptions>
): Promise<JWTUser> {
  const key =
    typeof publicKey === "string" ? publicKeyFromPem(publicKey) : publicKey;

  const opts = withDefaultVerifyOptions(options);

  const verify = await jwtVerify(token, key, {
    issuer: opts.issuer,
    algorithms: [JWT_ALGORITHM],
    audience: opts.audience,
  });

  const payload = verify.payload as JWTPayload;

  return {
    id: payload.sub,
    employeeReference: payload.ref,
    organizationReference: payload.org,
    roles: payload.rls,
    permissions: payload.prms,
  };
}

export function jwtUserHasRoles(
  jwtUser: JWTUser,
  roles: string | string[]
): boolean {
  const validateRoles = typeof roles === "string" ? [roles] : roles;
  return validateRoles.some((role) => jwtUser.roles.includes(role));
}
