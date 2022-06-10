const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const UPLOAD_FOLDER = "./uploads/";

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, UPLOAD_FOLDER);
   },
   filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
         file.originalname
            .replace(fileExt, "")
            .toLocaleLowerCase()
            .split(" ")
            .join("-") +
         "-" +
         Date.now();
      cb(null, fileName + fileExt);
   },
});

const upload = multer({
   storage: storage,
   limits: {
      fileSize: 1000000,
   },
   fileFilter: (req, file, cb) => {
      if (file.fieldname === "avatar") {
         if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
         ) {
            cb(null, true);
         } else {
            cb(new Error("Only .jpg, .png, or .jpeg formet allowed! "));
         }
      } else if (file.fieldname === "gallery") {
         if (file.mimetype === "application/pdf") {
            cb(null, true);
         } else {
            cb(new Error("Only .pdf formet allowed! "));
         }
      } else {
         cb(new Error(" No idea for this error "));
      }
   },
});

router.get("/", (req, res, next) => {
   res.status(200).send("Hello Send file");
});

router.post(
   "/",
   upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "gallery", maxCount: 2 },
   ]),
   (req, res, next) => {
      console.log(req.files);
      res.status(200).json({
         data: req.files,
      });
   }
);

module.exports = router;
