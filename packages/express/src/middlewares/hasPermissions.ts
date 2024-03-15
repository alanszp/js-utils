import { NextFunction, Response } from "express";
import { GenericRequest } from "../types/GenericRequest";
import { hasRoles } from "./hasRoles";
import { render401Error, render403Error } from "../helpers/renderErrorJson";

function response401(res: Response): void {
  res.status(401).json(render401Error(["jwt"]));
}

/**
 * Check if the jwtUser has a single permission
 * If not, check if the jwtUser has the required roles (to maintain backwards compatibility)
 * When neither permissions nor roles requirements are met, throw a NoPermissionError
 */
export function hasPermission(
  permission: string,
  oldRoleCodes?: string | string[]
) {
  return async (req: GenericRequest, res: Response, next: NextFunction) => {
    try {
      const { jwtUser } = req.context;
      if (!jwtUser) {
        return response401(res);
      }

      await jwtUser.validatePermission(permission);
      next();
    } catch (error: unknown) {
      if (oldRoleCodes) {
        return hasRoles(oldRoleCodes)(req, res, next);
      }
      next(error);
    }
  };
}

/**
 * Check if the jwtUser has at least one permission
 * If not, check if the jwtUser has the required roles (to maintain backwards compatibility)
 * When neither permissions nor roles requirements are met, throw a NoPermissionError
 */
export function hasSomePermission(
  permissions: string[],
  oldRoleCodes?: string | string[]
) {
  return async (req: GenericRequest, res: Response, next: NextFunction) => {
    try {
      const { jwtUser } = req.context;
      if (!jwtUser) {
        return response401(res);
      }

      await jwtUser.validateSomePermission(permissions);
      next();
    } catch (error: unknown) {
      if (oldRoleCodes) {
        return hasRoles(oldRoleCodes)(req, res, next);
      }
      next(error);
    }
  };
}

/**
 * Check if the jwtUser has all permissions
 * If not, check if the jwtUser has the required roles (to maintain backwards compatibility)
 * When neither permissions nor roles requirements are met, throw a NoPermissionError
 */
export function hasEveryPermission(
  permissions: string[],
  oldRoleCodes?: string | string[]
) {
  return async (req: GenericRequest, res: Response, next: NextFunction) => {
    try {
      const { jwtUser } = req.context;
      if (!jwtUser) {
        return response401(res);
      }

      await jwtUser.validateEveryPermission(permissions);
      next();
    } catch (error: unknown) {
      if (oldRoleCodes) {
        return hasRoles(oldRoleCodes)(req, res, next);
      }
      next(error);
    }
  };
}
