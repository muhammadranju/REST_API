const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
   const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

   if (!token) {
      return res.status(403).send("A token is required for authentication");
   }
   try {
      const decoded = jwt.verify(token, config.SCS_TOKEN);
      req.user = decoded;
   } catch (err) {
      res.status(401).send("Invalid Token");
      // res.redirect("user/login");
   }
   return next();
};

module.exports = verifyToken;
