const express = require("express");
const userRouter = express.Router();

const {
  register,
  login,
  users,
  deleteUser,
  verifyEmail,
  resetPassword
} = require("../controllers/user");
const authentication = require("./../middleware/authentication");
const authorization = require("./../middleware/authorization");

// any user can register and login
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/verifyEmail", verifyEmail);
userRouter.post("/resetPassword", resetPassword);

// only admin can show all users and delete a user
userRouter.get("/users", authentication, authorization, users);
userRouter.put("/user/:id", authentication, authorization, deleteUser);
// in this task we need soft delete

module.exports = userRouter;
