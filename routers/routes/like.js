const express = require("express");
const likeRouter = express.Router();

const { liked } = require("./../controllers/like");

const authentication = require("./../middleware/authentication");

likeRouter.put("/liked/:id", authentication, liked);

module.exports = likeRouter;
