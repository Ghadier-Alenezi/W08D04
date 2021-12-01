const express = require("express");
const userRouter = express.Router();

const { register, login, users, deleteUser } = require("../controllers/user");
const authentication = require("./../middleware/authentication");
const authorization = require("./../middleware/authorization");

// any user can register and login
userRouter.post("/register", register);
userRouter.post("/login", login);

// only admin can get all users and delete a user
userRouter.get("/users", authentication, authorization, users);
userRouter.delete("/user/:id", authentication, authorization, deleteUser);

module.exports = userRouter;
