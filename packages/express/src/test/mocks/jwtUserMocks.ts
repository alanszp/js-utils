import { JWTUser } from "@alanszp/jwt";

export const userJwtUserMock: JWTUser = {
  id: "1",
  employeeReference: "1",
  organizationReference: "test",
  roles: [],
  permissions: [],
  segmentId: null,
};

export const laraJwtUserMock: JWTUser = {
  id: "0",
  employeeReference: "0",
  organizationReference: "lara",
  roles: [],
  permissions: [],
  segmentId: null,
};
