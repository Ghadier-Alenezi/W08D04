const postModel = require("./../../db/models/post");
// const commentModel = require("./../../db/models/comment");

// add new post
const newPost = (req, res) => {
  const { title, desc, img } = req.body;
  try {
    const newPost = new postModel({
      title,
      desc,
      img,
      user: req.token.id,
    });
    newPost
      .save()
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } catch {
    (err) => {
      res.status(400).send(err);
    };
  }
};

// get all post ONLY admin
const getPosts = (req, res) => {
  try {
    postModel
      .find({ isDel: false })
      .populate("user", "userName -_id")
      .then((result) => {
        // console.log(result);
        res.status(200).json(result);
      });
  } catch (error) {
    res.status(400).json(error);
  }
};

// get post by user id
const getUserPosts = (req, res) => {
  try {
    postModel
      .find({ isDel: false, user: req.token.id })
      .populate("user", "userName -_id")
      .then((result) => {
        if (result) {
          res.status(200).json(result);
        }
      });
  } catch (error) {
    res.status(400).json(error);
  }
};

// update post by post id
const updatePost = (req, res) => {
  const { id } = req.params;
  const { desc } = req.body;
  try {
    postModel
      .findOne({ post: id, user: req.token.id, isDel: false })
      .then((result) => {
        if (result) {
          postModel
            .findByIdAndUpdate(id, { $set: { desc: desc } }, { new: true })
            .then((result) => {
              // console.log(result);
              res.status(200).json(result);
            });
        } else {
          res.status(404).json("you can't update someone else comment!");
        }
      });
  } catch (error) {
    res.status(400).json(error);
  }
};

// get post by Id ONLY admin
const getPostById = (req, res) => {
  const { id } = req.params;
  try {
    postModel
      .findById(id)
      .populate("user", "userName -_id")
      .then((result) => {
        // console.log(result);
        res.status(200).json(result);
      });
  } catch (error) {
    res.status(400).json(error);
  }
};

// user can delete the post by post id
const deletePost = (req, res) => {
  const { id } = req.params;
  try {
    postModel
      .findOne({ post: id, user: req.token.id, isDel: false })
      .then((result) => {
        if (result) {
          postModel
            .findByIdAndUpdate(id, { $set: { isDel: true } }, { new: true })
            .then((result) => {
              // console.log(result);
              res.status(200).json(result);
            });
        } else {
          res.status(404).json("you can't delete someone else comment!");
        }
      });
  } catch (error) {
    res.status(400).json(error);
  }
};

// admin delete a post
const deletePostByAdmin = (req, res) => {
  const { id } = req.params;
  try {
    postModel
      .findByIdAndUpdate(id, { $set: { isDel: true } }, { new: true })
      .then((result) => {
        // console.log(result);
        res.status(200).json(result);
      });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  newPost,
  getUserPosts,
  updatePost,
  getPosts,
  getPostById,
  deletePost,
  deletePostByAdmin,
};
