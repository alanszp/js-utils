import { AuthMethods, createAuthContext } from "./authenticateUser";
import { verifyJWT } from "@alanszp/jwt";
import {
  mockNext,
  mockRequest,
  mockResponse,
} from "../test/mocks/expressMocks";
import { laraJwtUserMock, userJwtUserMock } from "../test/mocks/jwtUserMocks";
import {
  apiKeyAuthOptions,
  bothMethodsAuthOptions,
  jwtAuthOptions,
  verifyOptions,
} from "../test/mocks/authOptionsMocks";

jest.mock("@alanszp/jwt");

describe("AuthenticateUser", () => {
  describe("authentication with only JWT", () => {
    describe("when jwt verifies correctly", () => {
      it("should authenticate correctly and call next", async () => {
        (verifyJWT as jest.Mock).mockResolvedValueOnce(userJwtUserMock);

        const req = mockRequest("Bearer token");
        const res = mockResponse();
        const next = mockNext();

        await createAuthContext(jwtAuthOptions)([AuthMethods.JWT])(
          req,
          res,
          next
        );

        expect(verifyJWT).toBeCalledWith("publicKey", "token", verifyOptions);
        expect(res.status).toHaveBeenCalledTimes(0);
        expect(res.json).toHaveBeenCalledTimes(0);
        expect(req.context.jwtUser).toMatchObject(userJwtUserMock);
        expect(req.context.authenticated).toStrictEqual(["jwt"]);
        expect(next).toBeCalledWith();
      });
    });

    describe("when jwt verifies incorrectly", () => {
      it("should not authenticate, should not call next, and it should return 401", async () => {
        (verifyJWT as jest.Mock).mockResolvedValueOnce(undefined);

        const req = mockRequest("Bearer token");
        const res = mockResponse();
        const next = mockNext();

        await createAuthContext(jwtAuthOptions)([AuthMethods.JWT])(
          req,
          res,
          next
        );

        expect(verifyJWT).toBeCalledWith("publicKey", "token", verifyOptions);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(req.context.jwtUser).toBe(undefined);
        expect(req.context.authenticated).toEqual([]);
        expect(next).toHaveBeenCalledTimes(0);
      });
    });

    describe("when jwt doesn't exist", () => {
      it("should not verify JWT, should not authenticate, should not call next, and it should return 401", async () => {
        const req = mockRequest("aa");
        const res = mockResponse();
        const next = mockNext();

        await createAuthContext(jwtAuthOptions)([AuthMethods.JWT])(
          req,
          res,
          next
        );

        expect(verifyJWT).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(req.context.jwtUser).toBe(undefined);
        expect(req.context.authenticated).toEqual([]);
        expect(next).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("authentication with only API KEY", () => {
    describe("when api key verifies correctly", () => {
      it("should authenticate correctly and call next", async () => {
        const req = mockRequest("token");
        const res = mockResponse();
        const next = mockNext();

        await createAuthContext(apiKeyAuthOptions)([AuthMethods.API_KEY])(
          req,
          res,
          next
        );

        expect(verifyJWT).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledTimes(0);
        expect(res.json).toHaveBeenCalledTimes(0);
        expect(req.context.jwtUser).toMatchObject(laraJwtUserMock);
        expect(req.context.authenticated).toStrictEqual(["api_key"]);
        expect(next).toBeCalledWith();
      });
    });

    describe("when api key verifies incorrectly", () => {
      it("should not authenticate, should not call next, and it should return 401", async () => {
        const req = mockRequest("invalidToken");
        const res = mockResponse();
        const next = mockNext();

        await createAuthContext(apiKeyAuthOptions)([AuthMethods.API_KEY])(
          req,
          res,
          next
        );

        expect(verifyJWT).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(req.context.jwtUser).toBe(undefined);
        expect(req.context.authenticated).toEqual([]);
        expect(next).toHaveBeenCalledTimes(0);
      });
    });

    describe("when api key doesn't exist", () => {
      it("should not verify api key, should not authenticate, should not call next, and it should return 401", async () => {
        const req = mockRequest(undefined as any);
        const res = mockResponse();
        const next = mockNext();

        await createAuthContext(apiKeyAuthOptions)([AuthMethods.API_KEY])(
          req,
          res,
          next
        );

        expect(verifyJWT).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(req.context.jwtUser).toBe(undefined);
        expect(req.context.authenticated).toEqual([]);
        expect(next).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("authentication with JWT and API KEY", () => {
    describe("when api key verifies correctly", () => {
      it("should authenticate correctly and call next", async () => {
        const req = mockRequest("token");
        const res = mockResponse();
        const next = mockNext();

        await createAuthContext(bothMethodsAuthOptions)([
          AuthMethods.API_KEY,
          AuthMethods.JWT,
        ])(req, res, next);

        expect(verifyJWT).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledTimes(0);
        expect(res.json).toHaveBeenCalledTimes(0);
        expect(req.context.jwtUser).toMatchObject(laraJwtUserMock);
        expect(req.context.authenticated).toStrictEqual(["api_key"]);
        expect(next).toHaveBeenCalledWith();
      });
    });

    describe("when api key verifies incorrectly", () => {
      it("should not authenticate, should not call next, and it should return 401", async () => {
        const req = mockRequest("invalidToken");
        const res = mockResponse();
        const next = mockNext();

        await createAuthContext(bothMethodsAuthOptions)([
          AuthMethods.API_KEY,
          AuthMethods.JWT,
        ])(req, res, next);

        expect(verifyJWT).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(req.context.jwtUser).toBe(undefined);
        expect(req.context.authenticated).toEqual([]);
        expect(next).toHaveBeenCalledTimes(0);
      });
    });

    describe("when jwt verifies correctly", () => {
      it("should authenticate correctly and call next", async () => {
        (verifyJWT as jest.Mock).mockResolvedValueOnce(userJwtUserMock);

        const req = mockRequest("Bearer token");
        const res = mockResponse();
        const next = mockNext();

        await createAuthContext(bothMethodsAuthOptions)([
          AuthMethods.API_KEY,
          AuthMethods.JWT,
        ])(req, res, next);

        expect(verifyJWT).toBeCalledWith("publicKey", "token", {
          issuer: "issuer",
          audience: "audience",
        });
        expect(res.status).toHaveBeenCalledTimes(0);
        expect(res.json).toHaveBeenCalledTimes(0);

        expect(req.context.jwtUser).toMatchObject(userJwtUserMock);

        expect(req.context.authenticated).toStrictEqual(["jwt"]);

        expect(next).toHaveBeenCalledWith();
      });
    });

    describe("when jwt verifies incorrectly", () => {
      it("should not authenticate, should not call next, and it should return 401", async () => {
        (verifyJWT as jest.Mock).mockResolvedValueOnce(undefined);

        const req = mockRequest("Bearer token");
        const res = mockResponse();
        const next = mockNext();

        await createAuthContext(bothMethodsAuthOptions)([
          AuthMethods.API_KEY,
          AuthMethods.JWT,
        ])(req, res, next);

        expect(verifyJWT).toBeCalledWith("publicKey", "token", {
          issuer: "issuer",
          audience: "audience",
        });
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(req.context.jwtUser).toBe(undefined);
        expect(req.context.authenticated).toEqual([]);
        expect(next).toHaveBeenCalledTimes(0);
      });
    });
  });
});
