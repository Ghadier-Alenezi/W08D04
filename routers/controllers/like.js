const likeModel = require("./../../db/models/like");
const postModel = require("./../../db/models/post");

// add like to a post
const liked = (req, res) => {
  // post id
  const { id } = req.params;
  try {
    likeModel.findOneAndRemove({ post: id }).then((result) => {
      if (result) {
        res.status(200).send("disliked");
      } else {
        const newLike = new likeModel({
          post: id,
          user: req.token.id,
          isLiked: true,
        });
        newLike
          .save()
          .then((result) => {
            res.status(201).send(result);
          })
          .catch((err) => {
            res.status(404).send(err);
          });
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

// get all likes ONLY admin
const allLikes = (req, res) => {
  try {
    likeModel.find().then((result) => {
      // console.log(result);
      res.status(200).json(result);
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = { liked, allLikes };
