import { RenderableView } from "@alanszp/errors";

/**
 * Internal server error
 * Error 500
 */
export const InternalServerErrorExample: RenderableView = {
  code: "internal_server_error",
  message: "Internal Server Error",
  context: {
    error: {
      name: "Non200ResponseError",
      message: "Non 200 Response Error",
    },
  },
  origin: "example-service:dev",
};

/**
 * Bad request
 * Error 400
 */
export const MalformedJSONExample = {
  code: "bad_request",
  message: "Malformed JSON",
  context: {},
  origin: "example-service:dev",
};

/**
 * Not Found
 * Error 404
 */
export const NotFoundExample = {
  code: "not_found",
  message: "Not Found",
  context: {},
  origin: "example-service:dev",
};
