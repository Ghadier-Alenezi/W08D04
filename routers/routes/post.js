const express = require("express");
const postRouter = express.Router();

const {
  newPost,
  getUserPosts,
  updatePost,
  getPosts,
  // deleteUserPost,
  getPostById,
  deletePost,
} = require("../controllers/post");
const authentication = require("./../middleware/authentication");
const authorization = require("./../middleware/authorization");

postRouter.post("/newPost", authentication, newPost);
postRouter.get("/userPost", authentication, getUserPosts);
postRouter.put("/updatePost/:id", authentication, updatePost);
// postRouter.put("/deleteUserPost", deleteUserPost);

postRouter.get("/posts", authentication, authorization, getPosts);
postRouter.get("/post/:id", authentication, authorization, getPostById);
postRouter.put("/deletePost/:id", authentication, authorization, deletePost);

module.exports = postRouter;
