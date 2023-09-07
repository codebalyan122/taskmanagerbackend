import mongoose from "mongoose";

async function connect() {
  mongoose.set("strictQuery", true);

  const db = mongoose.connect(
    "mongodb+srv://balyancode122:balyancode122@cluster0.m2273ok.mongodb.net/"
  );
  console.log("connected to db");
  return db;
}

export default connect;
