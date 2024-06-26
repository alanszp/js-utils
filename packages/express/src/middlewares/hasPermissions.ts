import { NextFunction, Response } from "express";
import { GenericRequest } from "../types/GenericRequest";
import { hasRoles } from "./hasRoles";
import { render401Error } from "../helpers/renderErrorJson";

function response401(res: Response): void {
  res.status(401).json(render401Error(["jwt"]));
}

/**
 * Check if the jwtUser has a single permission
 * If not, check if the jwtUser has the required roles (to maintain backwards compatibility)
 * When neither permissions nor roles requirements are met, throw a NoPermissionError
 */
export function hasPermission(permission: string) {
  return async (req: GenericRequest, res: Response, next: NextFunction) => {
    try {
      const { jwtUser } = req.context;
      if (!jwtUser) {
        return response401(res);
      }

      // TODO: Remove when we have service accounts, SA will have it's own permissions so this will not be needed.
      if (jwtUser.isServiceAccount()) {
        return hasRoles(["admin"])(req, res, next);
      }

      await jwtUser.validatePermission(permission);
      next();
    } catch (error: unknown) {
      next(error);
    }
  };
}

/**
 * Check if the jwtUser has at least one permission
 * If not, check if the jwtUser has the required roles (to maintain backwards compatibility)
 * When neither permissions nor roles requirements are met, throw a NoPermissionError
 */
export function hasSomePermission(permissions: string[]) {
  return async (req: GenericRequest, res: Response, next: NextFunction) => {
    try {
      const { jwtUser } = req.context;
      if (!jwtUser) {
        return response401(res);
      }

      // TODO: Remove when we have service accounts, SA will have it's own permissions so this will not be needed.
      if (jwtUser.isServiceAccount()) {
        return hasRoles(["admin"])(req, res, next);
      }

      await jwtUser.validateSomePermission(permissions);
      next();
    } catch (error: unknown) {
      next(error);
    }
  };
}

/**
 * Check if the jwtUser has all permissions
 * If not, check if the jwtUser has the required roles (to maintain backwards compatibility)
 * When neither permissions nor roles requirements are met, throw a NoPermissionError
 */
export function hasEveryPermission(permissions: string[]) {
  return async (req: GenericRequest, res: Response, next: NextFunction) => {
    try {
      const { jwtUser } = req.context;
      if (!jwtUser) {
        return response401(res);
      }

      // TODO: Remove when we have service accounts, SA will have it's own permissions so this will not be needed.
      if (jwtUser.isServiceAccount()) {
        return hasRoles(["admin"])(req, res, next);
      }

      await jwtUser.validateEveryPermission(permissions);
      next();
    } catch (error: unknown) {
      next(error);
    }
  };
}
