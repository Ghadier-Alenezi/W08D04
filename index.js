const express = require("express");
require("dotenv").config();
require("./db");

const app = express();
app.use(express.json());

const roleRouter = require("./routers/routes/role");
app.use(roleRouter);

const userRouter = require("./routers/routes/user");
app.use(userRouter);

const postRouter = require("./routers/routes/post");
app.use(postRouter);

const commentRouter = require("./routers/routes/comment");
app.use(commentRouter);

const likeRouter = require("./routers/routes/like");
app.use(likeRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`SERVER ON ${PORT}`);
});
