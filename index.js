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

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(formData.parse());
app.use(express.urlencoded({ extended: false }));

app.use(api);

app.listen(process.env.PORT || 3000, () => {
  console.log("App started on port " + process.env.PORT || 3000);
});
