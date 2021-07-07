import type { JWTPayload as LibPayload } from "jose/jwt/sign";

export interface JWTPayload extends LibPayload {
  id: string;
  fnm: string;
  lnm: string;
  em: string;
  ref: string | null;
  org: string;
  rls: string[];
  prms: string[];
}

export interface JWTUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeReference: string | null;
  organizationReference: string;
  roles: string[];
  permissions: string[];
}

export interface SignOptions {
  issuer: string;
  audience: string | string[];
  expiration: string | number;
}

export interface VerifyOptions {
  issuer: string;
  audience: string | string[];
}
