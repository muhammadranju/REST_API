const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
moment.locale("en");

// const userSchema = require("../Schema/userSchema");
// new mongoose.model("User", userSchema);

// function* generatedId() {
//    let index = 1;
//    while (true) {
//       yield index++;
//    }
// }
// const generatedUserId = generatedId();
// console.log(generatedUserId.next().value);
// console.log(generatedUserId.next().value);

// function uuid() {
//    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
//       let r = (Math.random() * 16) | 0,
//          v = c == "x" ? r : (r & 0x3) | 0x8;
//       return v.toString(16);
//    });
// }

const todoSchema = mongoose.Schema({
   id: {
      type: String,
      default: uuid(),
   },
   titel: {
      type: String,
      required: true,
   },
   dest: String,
   status: {
      type: String,
      enum: ["active", "inactive"],
   },
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
   },
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
});
// mongoose.model("Todo", todoSchema);
todoSchema.methods = {
   findActive: function () {
      return mongoose.model("Todo").find({ status: "active" });
   },
};

module.exports = todoSchema;
