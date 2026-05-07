const jwt = require("jsonwebtoken");

// Check if Admin is authenticated

const isAdminAuth = async (req, res) => {
    try {
        return res.json({
            success: true,
            email: req.adminEmail   // ✅ comes from middleware
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

const AdminLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.json({ success: false, message: "Email & Password Required" });

        }

        // Fixed logic: compare email to email and password to password

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });


            res.cookie('adminToken', token, {
                httpOnly: true,
                secure: false,        // ❗ MUST be false on HTTP
                sameSite: 'lax',      // ✅ allows cookies in most cases
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.json({ success: true, message: "Logged In Successfully" });

        } else {

            return res.json({ success: false, message: "Invalid Credentials" });
        }
    }
    catch (error) {

        return res.json({ success: false, message: error.message });
    }
}


const Adminlogout = async (req, res) => {
    try {

        res.clearCookie('adminToken', {
            httpOnly: true,
            secure: false,      // ❗ same as login
            sameSite: 'lax',    // ❗ same as login
        });

        return res.json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message }); // also fixed typo
    }
};


module.exports = { AdminLogin, Adminlogout, isAdminAuth };