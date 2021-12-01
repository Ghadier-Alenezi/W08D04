const likeModel = require("./../../db/models/like");
const postModel = require("./../../db/models/post");

// add like to a post
const liked = (req, res) => {
  // post id
  const { id } = req.params;
  try {
    postModel.findByIdA(id, () => {
      const likedPost = new likeModel({
        isLiked: true,
        user: req.token.id,
        post: id,
      });
      likedPost.save().then((result) => {
        //   console.log(req.token.id);
        res.status(201).json(result);
      });
    });
  } catch {
    (err) => {
      res.status(400).json(err);
    };
  }
};

module.exports = { liked };
