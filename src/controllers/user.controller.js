const getCurrentUser = asyncHandlers(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    
    console.log("Current user data:", user); // Debug log

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                fullName: user.fullName,
                role: user.role,
                email: user.email,
                username: user.username
            },
            "User details fetched successfully"
        )
    );
}); 