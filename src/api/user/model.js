import mongoose from "mongoose";
import {
  checkPassword,
  hashPassword,
} from "../../services/passwordCrypt/index.js";

const userSchema = mongoose.Schema({
  name: { type: String, maxLength: 30, required: true },
  surname: { type: String, maxLength: 30, required: true },
  dateOfBirth: { type: Date, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  post: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

userSchema.methods.checkPassword = function (password) {
  return checkPassword(password, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const { passwordToSave } = await hashPassword(this.password);
  this.password = passwordToSave;
  next();
});

export default mongoose.model("User", userSchema, "user");
