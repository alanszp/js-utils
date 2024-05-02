import type { JWTPayload as LibPayload } from "jose";

export interface JWTPayload extends LibPayload {
  sub: string;
  ref: string | null;
  org: string;
  rls: string[];
  prms: string;
  oorg: string | null;
  osub: string | null;
  oref: string | null;
  // segmentReference
  seg: string | null;
}

export interface IJWTUser {
  id: string;
  employeeReference: string | null;
  organizationReference: string;
  roles: string[];
  permissions: string;
  segmentReference: string | null;
  originalOrganizationReference?: string | null;
  originalId?: string | null;
  originalEmployeeReference?: string | null;
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
