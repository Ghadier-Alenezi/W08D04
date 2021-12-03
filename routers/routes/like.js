const express = require("express");
const likeRouter = express.Router();

const { liked, allLikes } = require("./../controllers/like");

const authentication = require("./../middleware/authentication");
const authorization = require("./../middleware/authorization");

likeRouter.post("/liked/:id", authentication, liked);
likeRouter.get("/allLikes", authentication, allLikes);

module.exports = likeRouter;
