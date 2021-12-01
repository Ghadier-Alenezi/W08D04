const express = require("express");
const postRouter = express.Router();

const {
  newPost,
  getUserPosts,
  updatePost,
  getPosts,
  deletePost
} = require("../controllers/post");
const authentication = require("./../middleware/authentication");
const authorization = require("./../middleware/authorization");

postRouter.post("/newPost", authentication, newPost);
postRouter.get("/userPost", authentication, getUserPosts);
postRouter.put("/updatePost/:id", authentication, updatePost);

postRouter.get("/posts", authentication, authorization, getPosts);
postRouter.put("/deletePost/:id", deletePost);

module.exports = postRouter;
