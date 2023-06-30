import type { JWTPayload as LibPayload } from "jose/jwt/sign";

export interface JWTPayload extends LibPayload {
  sub: string;
  ref: string | null;
  org: string;
  rls: string[];
  prms: string[];
  // segmentReference
  seg: string | null;
}

export interface JWTUser {
  id: string;
  employeeReference: string | null;
  organizationReference: string;
  roles: string[];
  permissions: string[];
  segmentReference: string | null;
}

export interface SignOptions {
  issuer: string;
  audience: string | string[];
  expiration: string | number;
}

export interface VerifyOptions {
  issuer: string | string[];
  audience: string | string[];
}
