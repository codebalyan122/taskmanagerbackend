import mongoose from "mongoose";

export const TaskSchema = new mongoose.Schema({
  id: {
    type: Number,
    index: true,
    unique: true,
  },
  text: {
    type: String,
    unique: true,
  },
  date: {
    type: String,
  },
  reminder: {
    type: Boolean,
  },
  user: { type: mongoose.ObjectId, ref: "User" },
});

export default mongoose.model.Task || mongoose.model("Tasks", TaskSchema);
