const userModel = require("./../../db/models/user");
const postModle = require("./../../db/models/post");
const commentModle = require("./../../db/models/comment");
const likeModle = require("./../../db/models/like");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SALT = Number(process.env.SALT);
const secret = process.env.SECRET_KEY;

const register = async (req, res) => {
  const { userName, email, password, avatar, role } = req.body;
  const savedEmail = email.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, SALT);
  try {
    const newUser = new userModel({
      userName,
      email: savedEmail,
      password: hashedPassword,
      avatar,
      role,
    });
    newUser.save().then((result) => {
      res.status(201).json(result);
    });
  } catch {
    (err) => {
      res.status(400).send(err);
    };
  }
};

const login = (req, res) => {
  const { userInput, password } = req.body;
  try {
    userModel
      .findOne({ $or: [{ email: userInput }, { userName: userInput }] })
      .then(async (result) => {
        if (result) {
          if (result.email === userInput || result.userName === userInput) {
            const hashedPassword = await bcrypt.compare(
              password,
              result.password
            );
            const payload = {
              role: result.role,
              id: result._id,
            };
            const options = {
              expiresIn: "600m",
            };
            if (hashedPassword) {
              const token = jwt.sign(payload, secret, options);
              // console.log(token);
              res.status(200).json({ result, token });
            } else {
              res.status(400).send("invalid user name or password");
            }
          } else {
            res.status(400).send("invalid user name or password");
          }
        } else {
          res.status(404).send("this user name not exist!");
        }
      });
  } catch {
    (err) => {
      console.log(err);
    };
  }
};

// show all users ONLY admin
const users = (req, res) => {
  try {
    userModel.find({ isDel: false }).then((result) => {
      res.status(200).json(result);
    });
  } catch {
    (err) => {
      res.status(400).send(err);
    };
  }
};

// soft delete to a user with posts,comments and likes ONLY admin
const deleteUser = (req, res) => {
  const { id } = req.params; // user id
  try {
    userModel.findByIdAndUpdate(id, { isDel: true }).then((result) => {
      if (result) {
        postModle
          .updateMany({ user: id, isDel: false }, { isDel: true })
          .then((result) => {
            console.log("delete user posts");
          });
        commentModle
          .updateMany({ user: id, isDel: false }, { isDel: true })
          .then((result) => {
            console.log("delete user comments");
          });
        likeModle
          .deleteMany({ user: id })
          .then((result) => {
            console.log("delete user likes");
          })
          .then((result) => {
            res.status(200).json("user soft deleted! Done");
          });
      } else {
        res.status(400).send("there is no user whith this id");
      }
    });
  } catch {
    (error) => {
      res.status(400).send(error);
    };
  }
};
module.exports = { register, login, users, deleteUser };
