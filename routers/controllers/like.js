const likeModel = require("./../../db/models/like");
const postModel = require("./../../db/models/post");

// add like to a post
const liked = (req, res) => {
  // post id
  try {
    const { id } = req.params;
    const newLike = new likeModel({
      post: id,
      user: req.token.id,
      isLiked: true
    },{new: true});
    newLike
      .save()
      .then((result) => {
        // console.log(result);
        res.status(201).send(result);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  } catch {
    (err) => {
      res.status(400).json(err);
    };
  }
};

module.exports = { liked };
