const router = require("express").Router();
const nodemailer = require("nodemailer");
const todoSchema = require("../Schema/todoSchema");
const userSchema = require("../Schema/userSchema");
const mongoose = require("mongoose");
const Todo = new mongoose.model("TODO", todoSchema);
const User = new mongoose.model("User", userSchema);
const checkLogin = require("../middleware/checkLogin");

//GET HTML RENDER
router.get("/render", async (req, res, next) => {
   res.status(200).render("pages/index");
});

//GET HTML RENDER
router.get("/mail2", async (req, res, next) => {
   // Generate test SMTP service account from ethereal.email
   // Only needed if you don't have a real mail account for testing
   let testAccount = await nodemailer.createTestAccount();

   // create reusable transporter object using the default SMTP transport
   let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
         user: "info.muhammadranju@gmail.com", // generated ethereal user
         pass: "rupuolwehsxwzzar", // generated ethereal password
      },
   });

   // send mail with defined transport object
   let info = await transporter.sendMail({
      from: "info.muhammadranju@gmail.com", // sender address
      to: "mdranju23@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
   });

   console.log("Message sent: %s", info.messageId);
   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

   // Preview only available when sending through an Ethereal account
   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});

//SENd A MAIL
router.get("/mail", async (req, res, next) => {
   let transporter = nodemailer.createTransport({
      host: "gmail",
      port: 2525,
      auth: {
         user: "info.muhammadranju@gmail.com",
         pass: "rupuolwehsxwzzar",
      },
   });
   message = {
      // from: "from-example@email.com",
      // to: "to-example@email.com",
      // subject: "Subject",
      // text: "Hello SMTP Email",
      from: "info.muhammadranju@gmail.com",
      to: "mdranju23@gmail.com",
      subject: "Subject",
      html: "<h1>Hello SMTP Email</h1>",
   };
   transporter.sendMail(message, function (error, info) {
      if (error) {
         console.log(error);
      } else {
         console.log("Email sent: " + info.response);
      }
   });
   res.json(message);
});

//GET ALL TODO
router.get("/", async (req, res, next) => {
   try {
      const data = await Todo.find({
         $or: [{}, { status: req.query.status }],
      })
         .select({
            // titel: 1,
            // status: 1,
            // _id: 0,
            __v: 0,
         })
         .populate("user", "name username");
      console.log(req.query.status);
      console.log(req.username);
      console.log(req.userId);
      res.status(200).json(data);
   } catch (error) {
      console.log(error.message);
      res.status(500).json({
         error: "There was server side error",
      });
      // next(error);
   }
});
//GET ALL TODO WITH ACTIVE STATUS
router.get("/active", checkLogin, async (req, res, next) => {
   try {
      // const todo = new Todo();
      const data = await Todo.find({ titel: /ranju/i });
      res.status(200).json({
         comment: data,
      });
   } catch (error) {
      res.status(500).json({
         error: "There was server side error",
      });
   }
});

//GET A TODO
router.get("/:id", checkLogin, async (req, res, next) => {
   try {
      const data = await Todo.find({
         _id: req.params.id,
         // day: req.body.day,
      })
         .select({
            _id: 0,
            __v: 0,
         })
         .limit(2);
      res.status(200).json({
         resutl: data,
         message: "success",
      });
   } catch (error) {
      // res.status(500).json({
      //    error: "There was server side error",
      // });
      next("Invalid failed to id find");
   }
});

//POST A TODO
router.post("/post", async (req, res, next) => {
   try {
      console.log(req.username);
      console.log(req.userId);
      const newTodo = await new Todo({
         ...req.body,
         user: req.userId,
      });
      const todo = await newTodo.save();
      await User.updateOne(
         {
            _id: req.userId,
         },
         {
            $push: {
               todos: todo._id,
            },
         }
      );
      res.status(200).json({
         result: req.body,
      });
   } catch (error) {
      res.status(500).json({
         // error: "There was server side error",
         error: error.message,
      });
   }
});

//POST ALL TODO
router.post("/all", async (req, res, next) => {
   try {
      const data = await Todo.insertMany(req.body);
      res.status(200).json({
         resutl: data,
         message: "Todo were inserted successfully",
      });
   } catch (error) {
      res.status(500).json({
         error: "There was server side error",
      });
   }
});

//PUT ALL TODO
router.put("/update", async (req, res, next) => {
   try {
      const data = await Todo.updateMany({ status: req.body.status });

      res.status(200).json({
         resutl: data,
      });
   } catch (error) {
      res.status(500).json({
         error: "There was server side error",
      });
   }
});
//PUT A TODO
router.put("/:id", async (req, res, next) => {
   try {
      const data = await Todo.findOneAndUpdate(
         { _id: req.params.id },
         {
            $set: {
               status: req.body.status,
            },
         },
         {
            new: true,
            useFindAndModify: false,
         }
      );
      res.status(200).json({
         resutl: data,
      });
      console.log(data);
   } catch (error) {
      res.status(500).json({
         error: "There was server side error",
      });
   }
});

//DELET ALL TODO
router.delete("/delete", async (req, res, next) => {
   try {
      const data = await Todo.deleteMany({});
      res.status(200).json({
         resutl: data,
         message: "Todo was Deleted successfully",
      });
   } catch (error) {
      res.status(500).json({
         error: "There was server side error",
      });
   }
});
//DELET A TODO
router.delete("/:id", async (req, res, next) => {
   try {
      const data = await Todo.findOneAndDelete({ _id: req.params.id });
      res.status(200).json({
         resutl: data,
         message: "Todo was Deleted successfully",
      });
   } catch (error) {
      res.status(500).json({
         error: "There was server side error",
      });
   }
});

module.exports = router;
