const express = require("express");
const postRouter = express.Router();

const {
  newPost,
  getUserPosts,
  updatePost,
  getPosts,
  deletePost,
  getPostById,
  deletePostByAdmin,
  likePost,
} = require("../controllers/post");
const authentication = require("./../middleware/authentication");
const authorization = require("./../middleware/authorization");

postRouter.get("/posts", getPosts);
postRouter.post("/newPost", authentication, newPost);
postRouter.get("/userPost", authentication, getUserPosts);
postRouter.put("/updatePost/:id", authentication, updatePost);
postRouter.put("/:id", authentication, deletePost);
postRouter.put("likePost/:id", authentication, likePost);
postRouter.get("/post/:id", authentication, getPostById);

// only admin delete any post
postRouter.put(
  "/posts/post/:id",
  authentication,
  authorization,
  deletePostByAdmin
);

module.exports = postRouter;
