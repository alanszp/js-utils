import type { JWTPayload as LibPayload } from "jose";

export interface JWTPayload extends LibPayload {
  sub: string;
  ref: string | null;
  org: string;
  // old role codes
  rls: string[];
  // role ids
  rl: string[];
  prms: string;
  oorg: string | null;
  osub: string | null;
  oref: string | null;
  // segmentReference
  seg: string | null;
}

export interface IJWTUser {
  jwtId?: string | null;
  id: string;
  employeeReference: string | null;
  organizationReference: string;
  roleReferences: string[];
  roles: string[];
  permissions: string;
  segmentReference: string | null;
  originalOrganizationReference?: string | null;
  originalId?: string | null;
  originalEmployeeReference?: string | null;
  expirationTime?: number;
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

export interface Permission {
  code: string;
  description: string;
  position: number;
  priority: number | null;
  organizationReference: string;
}
