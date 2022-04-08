import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import api from "./src/api/index.js";
import mongooseInit from "./src/services/db/mongoose.js";
import formData from "express-form-data";

await mongooseInit();
mongoose.set("debug", true);

const app = express();

app.use(formData.parse());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.SERVER_URI); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(api);

app.listen(process.env.PORT || 3000, () => {
  console.log("App started on port " + process.env.PORT || 3000);
});
