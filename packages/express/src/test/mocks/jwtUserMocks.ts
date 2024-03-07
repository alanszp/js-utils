import { JWTUser } from "@alanszp/jwt";

export const userJwtUserMock: JWTUser = new JWTUser({
  id: "1",
  employeeReference: "1",
  organizationReference: "test",
  roles: [],
  permissions: "MA==",
  segmentReference: null,
});

export const laraJwtUserMock: JWTUser = new JWTUser({
  id: "0",
  employeeReference: "0",
  organizationReference: "lara",
  roles: [],
  permissions: "MA==",
  segmentReference: null,
});
