require("dotenv").config()
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    console.log(req.headers)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return res.status(400).json({ message: "Login karle pehle" })
    jwt.verify(token, process.env.MAIN_SECRET, (err, userinfo) => {
        if (err)
            return res.status(400).json({ message: err.message });
        console.log(userinfo)
        req.user = userinfo.user.username;
        next();
    })
}

module.exports = { authMiddleware }