const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = require("../Schema/userSchema");
const User = new mongoose.model("USER", userSchema);
const auth = require("../middleware/auth");
const checkLogin = require("../middleware/checkLogin");

//GET DATA
router.get("/signup", checkLogin, async (req, res, next) => {
   try {
      const data = await User.find({ status: "active" }).populate("todos");
      res.status(200).json({ users: data });
      // const data = await User.find({})
      //    .select({
      //       id: 0,
      //       __v: 0,
      //    })
      //    .populate("todo");
      console.log(req.username);
      console.log(req.userId);
      // res.status(200).json({
      //    comment: data,
      // });
   } catch (error) {
      console.log(error.message);
      res.status(500).json({
         error: "Can not get user data",
      });
   }
});

// router.get("/signup", async (req, res, next) => {
//    try {
//       const data = await User.find({});

//       res.status(200).json({
//          comment: data,
//       });
//    } catch (error) {
//       res.status(500).json({
//          error: "There was server side error",
//       });
//    }
// });

// SIGNUP POST
router.post("/signup", async (req, res, next) => {
   try {
      const { name, username, password } = req.body;
      const usernameLpwerCase = username.toLowerCase();
      const usernameSplit = usernameLpwerCase.split(" ");
      const usernameJoin = usernameSplit.join("");

      // Finding to
      // if (!(name && username && password)) {
      //    return res.status(400).json({ message: "All input is required" });
      // }

      if (!name) {
         return res.status(400).json({ message: "Name is required" });
      } else if (!username) {
         return res.status(400).json({ message: "Username is required" });
      } else if (!password) {
         return res.status(400).json({ message: "Password is required" });
      }
      const oldUser = await User.findOne({ username });
      if (oldUser) {
         return res.status(409).json({
            error: "User Already Exist. Please Login",
         });
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
         name,
         username: usernameJoin,
         password: hashPassword,
      });

      const token = jwt.sign(
         { userId: user._id, username },
         process.env.SCS_TOKEN,
         {
            expiresIn: "3h",
         }
      );
      user.token = token;

      return res.status(201).json({
         user: user,
         token: user.token,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         error: "Signup failed",
      });
   }
});

//
router.get("/login", (req, res, next) => [
   res.status(200).json({
      message: "Please login",
   }),
]);
router.post("/login", async (req, res) => {
   try {
      const { username, password } = req.body;
      if (!(username && password)) {
         return res.status(400).json({ message: "All input is required" });
      }
      const user = await User.findOne({ username });
      if (user && (await bcrypt.compare(password, user.password))) {
         const token = jwt.sign(
            {
               userId: user._id,
               username,
            },
            process.env.SCS_TOKEN,
            {
               expiresIn: "1h",
            }
         );
         user.token = token;
         return res.status(200).json({
            user: user,
            token: user.token,
         });
      } else {
         return res.status(400).json({ error: "Invalid Credentials" });
      }
   } catch (error) {
      return res.status(401).json({
         error: "Authentisign  failed",
      });
   }
});

module.exports = router;
