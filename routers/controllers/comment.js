const commentModel = require("../../db/models/comment");

// add new comment
const newComment = (req, res) => {
  const { desc, post } = req.body;
  try {
    const userComment = new commentModel({
      desc,
      post,
      user: req.token.id,
    });
    userComment.save().then((result) => {
      // console.log(result);
      res.status(201).json(result);
    });
  } catch {
    (err) => {
      res.status(400).json(err);
    };
  }
};

// get all comments ONLY admin
const comments = (req, res) => {
  try {
    commentModel.find({}).then((result) => {
      res.status(200).json(result);
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

// get comment by user Id
const userComment = (req, res) => {
  try {
    commentModel.find({ isDel: false, user: req.token.id }).then((result) => {
      res.status(200).json(result);
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

// update comment by id
const updateComment = (req, res) => {
  const { id } = req.params;
  const { desc } = req.body;
  try {
    commentModel
      .findByIdAndUpdate(id, { desc }, { new: true })
      .then((result) => {
        // console.log(result);
        res.status(200).json(result);
      });
  } catch (error) {
    res.status(400).json(error);
  }
};

// soft delete to one comment
const deleteComment = (req, res) => {
  const { id } = req.params;
  try {
    commentModel
      .findByIdAndUpdate(id, { isDel: true }, { new: true })
      .then((result) => {
        res.status(200).json(result);
      });
  } catch (error) {
    res.status(400).json(error);
  }
};
module.exports = {
  newComment,
  comments,
  userComment,
  updateComment,
  deleteComment,
};