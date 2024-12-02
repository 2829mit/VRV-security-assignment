import { ApiError } from "../utils/ApiError.js";
import { asyncHandlers } from "../utils/asyncHandlers.js";
import { User } from "../models/user.model.js";

const hasRole = (roles) => {
    return asyncHandlers(async (req, res, next) => {
        const user = await User.findById(req.user?._id);
        
        if (!user) {
            throw new ApiError(401, "Unauthorized request");
        }

        if (!roles.includes(user.role)) {
            throw new ApiError(403, "You don't have permission to access this resource");
        }

        next();
    });
};

const hasPermission = (permission) => {
    return asyncHandlers(async (req, res, next) => {
        const user = await User.findById(req.user?._id);
        
        if (!user) {
            throw new ApiError(401, "Unauthorized request");
        }

        if (!user.permissions.includes(permission)) {
            throw new ApiError(403, "You don't have permission to perform this action");
        }

        next();
    });
};

const isOwnerOrAdmin = (Model) => {
    return asyncHandlers(async (req, res, next) => {
        const resourceId = req.params.id;
        const userId = req.user?._id;

        const resource = await Model.findById(resourceId);
        if (!resource) {
            throw new ApiError(404, "Resource not found");
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(401, "Unauthorized request");
        }

        if (user.role !== "admin" && resource.user?.toString() !== userId?.toString()) {
            throw new ApiError(403, "You don't have permission to modify this resource");
        }

        next();
    });
};

export { hasRole, hasPermission, isOwnerOrAdmin };
