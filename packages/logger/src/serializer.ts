import JSON5 from "json5";
import {isString, keys, mapValues} from "lodash";
import { Context } from "./interfaces";

function stringify(obj: any) {
    if (isString(obj)) {
        return obj;
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
