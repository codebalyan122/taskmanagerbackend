import { Router } from "express";

import {
  register,
  login,
  verifyUser,
  Tasks,
  getTasks,
} from "../controllers/appControllers.js";

const router = Router();
router.route("/register").post(register);
router.route("/authenticate").post(verifyUser, (req, res) => res.end());
router.route("/login").post(verifyUser, login);
router.route("/register-tasks").post(Tasks);
router.route("/tasks").get(getTasks);

export default router;
