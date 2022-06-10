const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const timespan = require("jsonwebtoken/lib/timespan");

// const todoSchema = require("../Schema/todoSchema");
// new mongoose.model("TODO", todoSchema);

const userSchema = mongoose.Schema(
   {
      id: {
         type: String,
         default: uuidv4(),
      },
      name: {
         type: String,
         required: true,
      },
      username: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
      },
      password: {
         type: String,
         required: true,
      },
      status: {
         type: String,
         enum: ["active", "inactive"],
      },
      todo: [
         {
            type: mongoose.Types.ObjectId,
            ref: "Todo",
         },
      ],
      date: {
         type: String,
         default: moment().format("DD/MM/YYYY"),
      },
      time: {
         type: String,
         default: moment().format("LTS"),
      },
      day: {
         type: String,
         default: moment().format("dddd").toLocaleLowerCase(),
      },
   },
   { timespan: true }
);

module.exports = userSchema;
