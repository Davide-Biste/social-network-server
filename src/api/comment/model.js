import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  post: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model("Comment", commentSchema, "comment");
