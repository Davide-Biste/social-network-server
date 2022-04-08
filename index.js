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

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // For legacy browser support
  methods: "GET, PUT, POST, DELETE",
};

app.use(cors(corsOptions));
app.use(api);

app.listen(process.env.PORT || 3000, () => {
  console.log("App started on port " + process.env.PORT || 3000);
});
