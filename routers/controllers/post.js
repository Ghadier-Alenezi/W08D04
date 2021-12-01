const postModel = require("./../../db/models/post");

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
    newPost.save().then((result) => {
      res.status(201).json(result);
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
    postModel.find({}).then((result) => {
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
    // console.log(req.token.id);
    postModel.find({ isDel: false, user: req.token.id }).then((result) => {
      res.status(200).json(result);
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

// update post by post id
const updatePost = (req, res) => {
  const { id } = req.params;
  const { title, desc, img } = req.body;
  try {
    postModel
      .findByIdAndUpdate(id, { title, desc, img, user: req.token.id }, { new: true })
      .then((result) => {
        // console.log(result);
        res.status(200).json(result);
      });
  } catch (error) {
    res.status(400).json(error);
  }
};

// delete post by post id ONLY admin
const deletePost = (req, res) => {
  const { id } = req.params;
  try {
    postModel
      .findByIdAndUpdate(id, { isDel: true }, { new: true })
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
  deletePost,
};
