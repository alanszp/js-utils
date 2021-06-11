import JSON5 from "json5";
import { isString, keys, mapValues } from "lodash";
import { Context } from "./interfaces";

function stringify(obj: unknown): string {
  if (isString(obj)) {
    return obj;
  }

  if (obj instanceof Error) {
    return errorSerializer(obj);
  }

  try {
    return JSON5.stringify(obj);
  } catch (e) {
    // If we cant stringify we will let the bunyan serializer to make the magic.
    // This is just to detect the logs that are having trouble and then fix it
    // in the log statement. (The error this may produce is due to circular
    // reference, so this is a dev issue, who is not logging in a proper way)
    return stringify({
      parsing_error: e.message,
      object_keys: keys(obj),
    });
  }
}

export function serialize(obj: Context) {
  return mapValues(obj, stringify);
}

/* Based on Bunyan error serializer */
function getFullErrorStack(ex): string {
  let ret = ex.stack || ex.toString();
  if (ex.cause && typeof ex.cause === "function") {
    const cex = ex.cause();
    if (cex) {
      ret += `\nCaused by: ${getFullErrorStack(cex)}`;
    }
  }
  return ret;
}

/* Based on Bunyan error serializer */
function errorSerializer(err) {
  if (!err || !err.stack) {
    return err;
  }
  return {
    message: err.message,
    name: err.name,
    code: err.code,
    context: err.context,
    status: err.status,
    signal: err.signal,
    devMessage: err.devMessage,
    stack: getFullErrorStack(err),
  };
}
