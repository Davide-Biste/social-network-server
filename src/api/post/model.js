import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  type: { type: String, required: true, enum: ["photo", "video"] },
  description: { type: String },
  uri: { type: String, required: true },
  like: { type: Number, default: 0 },
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model("Post", postSchema, "post");
