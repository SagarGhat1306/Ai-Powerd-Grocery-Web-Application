const jwt = require("jsonwebtoken");

const authAdmin = async (req, res, next) => {
    try {
        const { adminToken } = req.cookies;

        //  No token
        if (!adminToken) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized - No Token"
            });
        }

        // ✅ Verify token
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);

        //  Invalid admin
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({
                success: false,
                message: "Not Authorized - Invalid Admin"
            });
        }

        //  Attach admin info (VERY IMPORTANT for future use)
        req.adminEmail = decoded.email;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token Invalid or Expired"
        });
    }
};

module.exports = authAdmin;