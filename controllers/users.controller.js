const user = require("../models/users");
const { v4: uuidv4 } = require("uuid");

// get users
const getAllUser = (req, res) => {
   res.json({ user });
};

// const getAllUser = (req, res) => {
//    async function getData(res) {
//       let resutl = await client.connect();
//       const db = resutl.db("userDB");
//       const collection = db.collection("users");
//       const responce = await collection.find({}).toArray();
//       //   console.log(responce);
//       res.json(responce);
//    }
//    getData(res);
// };

//find user
const getIdUser = (req, res) => {
   const userId = req.params.id;
   user
      .filter((user) => user.id === userId)
      .map((arr) => {
         console.log(arr);
         res.json(arr);
      });
};

// create users
const createUser = (req, res) => {
   const newUser = {
      id: uuidv4(),
      username: req.body.username,
      email: req.body.email,
   };
   user.push(newUser);
   res.json(user);
};

// update user
const updateUser = (req, res) => {
   const userid = req.params.id;
   const { username, email } = req.body;
   user
      .filter((user) => user.id === userid)
      .map((selecteduser) => {
         selecteduser.username = username;
         selecteduser.email = email;
      });
   res.status(200).json(user);
};

// delete user
const deleteUser = (req, res) => {
   const userid = req.params.id;
   user = user.filter((user) => user.id !== userid);
   res.status(200).json(user);
};

module.exports = { getAllUser, getIdUser, createUser, updateUser, deleteUser };
