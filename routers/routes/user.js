const express = require("express");
const userRouter = express.Router();

const { register, login, users, deleteUser } = require("../controllers/user");
const authentication = require("./../middleware/authentication");
const authorization = require("./../middleware/authorization");

// any user can register and login
userRouter.post("/register", register);
userRouter.post("/login", login);

// only admin can get all users and delete a user
userRouter.get("/users", users);
userRouter.put("/user/:id", deleteUser);
// in this task we need soft delete

module.exports = userRouter;
