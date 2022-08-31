import {
  ApiKeyOptions,
  AuthMethods,
  BothMethodsOptions,
  JWTOptions,
} from "../../middlewares/authenticateUser";

export const jwtAuthOptions = {
  jwtVerifyOptions: {
    publicKey: "publicKey",
    issuer: "issuer",
    audience: "audience",
  },
  types: [AuthMethods.JWT],
} as any as JWTOptions;

export const verifyOptions = {
  issuer: "issuer",
  audience: "audience",
};

export const apiKeyAuthOptions: ApiKeyOptions = {
  validApiKeys: ["token", "tooooken"],
  types: [AuthMethods.API_KEY],
};

export const bothMethodsAuthOptions: BothMethodsOptions = {
  jwtVerifyOptions: {
    publicKey: "publicKey",
    issuer: "issuer",
    audience: "audience",
  },
  validApiKeys: ["token", "tooooken"],
  types: [AuthMethods.API_KEY, AuthMethods.JWT],
};
