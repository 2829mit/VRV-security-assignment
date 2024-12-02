import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandlers } from "../utils/asyncHandlers.js";
import jwt from "jsonwebtoken";

// Add audit logging
const auditLog = async (userId, action, details) => {
    // You might want to create a separate AuditLog model
    console.log(`AUDIT: User ${userId} performed ${action}. Details: ${JSON.stringify(details)}`);
};

export const verifyJWT = asyncHandlers(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Add audit log for authentication
        await auditLog(user._id, 'authentication', { 
            timestamp: new Date(),
            action: 'verify_jwt',
            success: true
        });

        req.user = user;
        next();
    } catch (error) {
        // Log failed attempts
        await auditLog('unknown', 'authentication_failed', {
            timestamp: new Date(),
            error: error.message
        });
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});

// Role hierarchy for more granular control
const roleHierarchy = {
    admin: ['moderator', 'user'],
    moderator: ['user'],
    user: []
};

// Enhanced audit middleware
const auditMiddleware = asyncHandlers(async (req, res, next) => {
    const user = req.user;
    const action = `${req.method} ${req.path}`;
    
    await auditLog(user?._id, action, {
        timestamp: new Date(),
        method: req.method,
        path: req.path,
        role: user?.role,
        ip: req.ip
    });
    
    next();
});

export { auditMiddleware };
