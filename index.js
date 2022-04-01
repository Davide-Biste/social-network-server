import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import api from "./src/api/index.js";

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(api);

app.listen(process.env.PORT || 3000, () => {
  console.log("App started on port " + process.env.PORT || 3000);
});
