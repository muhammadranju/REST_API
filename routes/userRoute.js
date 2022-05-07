const router = require("express").Router();
const {
   getAllUser,
   getIdUser,
   createUser,
   updateUser,
   deleteUser,
} = require("../controllers/users.controller");

router.get("/", getAllUser);
router.get("/:id", getIdUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
