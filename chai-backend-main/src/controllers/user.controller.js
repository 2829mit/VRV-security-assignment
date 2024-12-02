import { asyncHandlers } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// ... other imports ...

const registerUser = asyncHandlers(async (req, res) => {
    const { fullName, email, username, password, role } = req.body;

    if (!fullName || !email || !username || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    let avatarLocalPath;
    if (req.file) {
        avatarLocalPath = req.file.path;
    }

    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        avatar: avatarLocalPath,
        role: role || "user"
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    console.log("User registered successfully:", createdUser.username); // Add logging
    return res.status(201).json(
        new ApiResponse(
            201, 
            createdUser, 
            `User ${createdUser.username} registered successfully! Please login.`
        )
    );
});

const loginUser = asyncHandlers(async (req, res) => {
    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    console.log(`User ${user.username} logged in successfully`); // Add logging
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {
                    user: loggedInUser, 
                    accessToken, 
                    refreshToken
                },
                `Welcome back, ${user.fullName}! You're now logged in.`
            )
        );
});

const logoutUser = asyncHandlers(async (req, res) => {
    // Get user details before logout for the message
    const user = await User.findById(req.user._id);
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    console.log(`User ${user.username} logged out successfully`); // Add logging
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200, 
                {},
                `Goodbye, ${user.fullName}! You've been logged out successfully.`
            )
        );
});

const getCurrentUser = asyncHandlers(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const getAllUsers = asyncHandlers(async (req, res) => {
    const users = await User.find()
        .select("-password -refreshToken")
        .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            users,
            "Users fetched successfully"
        )
    );
});

const getRoleSpecificData = asyncHandlers(async (req, res) => {
    const user = req.user;
    let data = "";

    if (user.role === "admin") {
        data = "Data shown to Admin: Full access to all features and user management";
    } else {
        data = "Data shown to User: Limited access to basic features";
    }

    return res.status(200).json(
        new ApiResponse(200, { role: user.role, data }, `Data for ${user.role} role`)
    );
});

const updateUserRole = asyncHandlers(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
        throw new ApiError(400, "Role is required");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User role updated successfully")
    );
});

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    getAllUsers,
    updateUserRole,
    getRoleSpecificData
};