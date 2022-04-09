import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  type: { type: String, required: true, enum: ["photo", "video"] },
  description: { type: String },
  uri: { type: String, required: true, default: "loading..." },
  whoPutLike: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", postSchema, "post");
