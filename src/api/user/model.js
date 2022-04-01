import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, maxLength: 30, required: true },
  surname: { type: String, maxLength: 30, required: true },
  dateOfBirth: { type: Date, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

export default mongoose.model("User", userSchema, "user");
