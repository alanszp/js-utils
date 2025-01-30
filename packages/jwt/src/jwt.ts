import { v4 as uuidv4 } from "uuid";
import { createPublicKey, createPrivateKey, KeyObject } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload, SignOptions, VerifyOptions } from "./types";
import { JWTUser } from "./JWTUser";

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

  return new SignJWT(user.toTokenPayload())
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setIssuer(opts.issuer)
    .setAudience(opts.audience)
    .setExpirationTime(opts.expiration)
    .setJti(uuidv4())
    .sign(key);
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

  const user = JWTUser.fromPayload(payload);

  user.setRawToken(token);

  return user;
}
