const postModel = require("./../../db/models/post");
const commentModel = require("./../../db/models/comment");

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
    postModel.find({ isDel: false }).then((result) => {
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
        }else{
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
    postModel.findById(id).then((result) => {
      // console.log(result);
      res.status(200).json(result);
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

// // user can delete the post by post id
// const deleteUserPost = (req, res) => {
//   // const { id } = req.params;
//   try {
//     postModel
//       .find()
//       .then((result) => {
//         console.log(result);
//         // console.log(req.token.id);
//         // res.status(200).json(result);
//       });
//   } catch (error) {
//     res.status(400).json(error);
//   }
// };

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
  // deleteUserPost,
  getPostById,
  deletePost,
};
