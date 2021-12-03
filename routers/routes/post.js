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
} = require("../controllers/post");
const authentication = require("./../middleware/authentication");
const authorization = require("./../middleware/authorization");

postRouter.post("/newPost", authentication, newPost);
postRouter.get("/userPost", authentication, getUserPosts);
postRouter.put("/updatePost/:id", authentication, updatePost);
postRouter.put("/deletePost/:id", authentication, deletePost);

// only admin can show all posts and show one post by id, delete a post
postRouter.get("/posts", authentication, authorization, getPosts);
postRouter.get("/post/:id", authentication, authorization, getPostById);
postRouter.put("/post/:id", authentication, authorization, deletePostByAdmin);

module.exports = postRouter;
