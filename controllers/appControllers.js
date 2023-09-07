import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";
import UserModel from "../model/User.model.js";
import TaskModel from "../model/Task.model.js";

export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method === "GET" ? req.query : req.body;

    let userExist = UserModel.findOne({ username });
    if (!userExist)
      return res.status(404).send({ error: "Can't find  the user" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentcation Error" });
  }
}

export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;
    console.log("username", username);
    const usernameExist = await UserModel.findOne({ username });
    const emailExist = await UserModel.findOne({ email });
    if (usernameExist || emailExist) {
      return res.status(500).send({ error: "username or email already exist" });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({
        username,
        password: hashedPassword,
        profile: profile || "",
        email,
      });
      const token = jwt.sign(
        {
          user: user._id,
        },
        ENV.JWT_SECRET,
        { expiresIn: "24h" }
      );

      user.save().then((result) => {
        return res.status(201).send({ msg: "user Registered", token });
      });
    } else {
      throw new Error({ msg: "password was not able to hashed" });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  console.log(email);

  try {
    const user = await UserModel.findOne({ email });
    console.log(user);
    if (user) {
      const passwordCheck = await bcrypt.compare(password, user.password);

      if (!passwordCheck)
        return res.status(400).send({ error: "password not match" });

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
        },
        ENV.JWT_SECRET,
        { expiresIn: "24h" }
      );
      return res.status(200).send({
        msg: "Login successfull",
        user: user,
        token,
      });
    } else {
      return res.status(500).send({ msg: "username not found" });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
}

export async function Tasks(req, res) {
  const { id, text, reminder, date, email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    console.log(user);
    if (!user) {
      res.status(404).send({ msg: "user not found " });
    } else {
      const task = await new TaskModel({
        id,
        text,
        reminder,
        date,
        user: user._id,
      });
      await task.save({ task }).then(() => {
        return res.status(201).json(task);
      });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).send({ msg: "error found" });
  }
}

export async function getTasks(req, res) {
  console.log(req.query);
  const { q } = req.query;
  console.log(q);
  try {
    const user = await UserModel.findOne({ email: q });
    console.log(user);

    if (!user) {
      return res.status(404).send("User Not Found");
    }

    const tasks = await TaskModel.find({ user: user._id }).populate("user");

    if (tasks.length < 1) {
      return res.status(404).json({ error: "tasks not found" });
    }
    return res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
