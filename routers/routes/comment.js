const express = require("express");
const commentRouter = express.Router();

const {
  newComment,
  comments,
  userComment,
  updateComment,
  deleteComment,
  deleteComForEver
} = require("./../controllers/comment");

const authentication = require("./../middleware/authentication");
const authorization = require("./../middleware/authorization");

commentRouter.post("/newComment/:id", authentication, newComment);
commentRouter.get("/comments", authentication, comments);
commentRouter.get("/userComment", authentication, userComment);
commentRouter.put("/updateComment/:id", authentication, updateComment);
commentRouter.put("/deleteComment/:id", authentication, deleteComment);
commentRouter.delete("/deleteComForEver/:id", authentication, deleteComForEver);

module.exports = commentRouter;
