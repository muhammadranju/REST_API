const router = require("express").Router();
//GET HTML RENDER
router.get("/", async (req, res, next) => {
   res.redirect("https://www.youtube.com/");
});

module.exports = router;
