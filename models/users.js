const { v4: uuidv4 } = require("uuid");
const users = [
   {
      id: uuidv4(),
      username: "Md Ranju",
      email: "mdranju23@gmail.com",
   },
   {
      id: uuidv4(),
      username: "Amin",
      email: "mdamin@gmail.com",
   },
   {
      id: uuidv4(),
      username: "hossain",
      email: "hossain@gmail.com",
   },
];

module.exports = users;
