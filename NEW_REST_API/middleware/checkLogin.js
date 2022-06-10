const jwt = require("jsonwebtoken");

const chackLogin = (req, res, next) => {
   const { authorization } = req.headers;
   try {
      const token = authorization;
      const decoded = jwt.verify(token, process.env.SCS_TOKEN);
      const { username, userId } = decoded;
      req.username = username;
      req.userId = userId;
      next();
   } catch (error) {
      //   console.log(error);
      next("Authentication failure!");
   }
};

module.exports = chackLogin;
