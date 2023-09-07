import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "please provide unique username"],
    unique: [true, "Username Exist"],
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Please provide a unique email"],
    unique: true,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  mobile_no: { type: Number },
  address: {
    type: String,
  },
  profile: {
    type: String,
  },
});

export default mongoose.model.User || mongoose.model("User", UserSchema);
