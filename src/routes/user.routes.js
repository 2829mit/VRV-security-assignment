router.route("/current-user")
    .get(verifyJWT, getCurrentUser); 