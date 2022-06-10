// app dependencies requires handles
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");

const todoHandler = require("./routes/todoHandler");
const userHandler = require("./routes/userHandler");
const sendFileHandler = require("./routes/sendFileHandler");
const shotLink = require("./routes/shotLink");

// ENV defined
const config = process.env;

// ENV configure
dotenv.config();

// database connection handler
// const URL = "mongodb://127.0.0.1/todos";
const URL = config.DATABASE_URL;
mongoose
   .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log("Connection Successfully"))
   .catch((err) => console.log(err));

// app is using express function
const app = express();

// express use handler
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");

app.get("/", (req, res, next) => {
   try {
      return res.status(200).send("Hello Welcome to the node js website!");
   } catch (error) {
      next(error);
   }
});

// all routes handler
// app.use(golink(), shotLink);
app.use("/api", todoHandler);
app.use("/user", userHandler);
app.use("/send", sendFileHandler);

//page not fount error handler
app.use((req, res, next) => {
   return res.status(404).json({ message: "404 page not found" });
});

// server error handler
app.use((err, req, res, next) => {
   if (res.headersSent) {
      next("There was a problem!");
   } else {
      if (err.message) {
         return res.status(500).send(err.message);
      } else {
         return res.status(500).json({
            // error: "There are server side error",
            error: err,
         });
      }
   }
   return res.status(500).json({ message: "server problem" });
});

// app.use((err, req, res, next) => {
//    if (err.message) {
//       if (err instanceof multer.MulterError) {
//          console.log(err.message);
//          res.status(500).send(err.message);
//       } else {
//          console.log(err.message);
//          return res.status(500).send(err.message);
//       }
//    } else {
//       return res.status(500).json({ message: "server problem" });
//    }
// });

//app listening handler
app.listen(config.PORT, () => {
   console.log(`app is running on http://localhost:${config.PORT}`);
});
