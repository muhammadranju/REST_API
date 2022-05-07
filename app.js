const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const userRoute = require("./routes/userRoute");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/users", userRoute);

app.get("/", (req, res) => {
   res.sendFile(__dirname + "/views/index.html");
});
app.use((req, res, next) => {
   res.status(404).json({ message: "404 page not found" });
});
app.use((err, req, res, next) => {
   res.status(500).json({ message: "Server error" });
});
module.exports = app;
