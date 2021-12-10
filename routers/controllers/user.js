const userModel = require("./../../db/models/user");
const postModle = require("./../../db/models/post");
const commentModle = require("./../../db/models/comment");
const likeModle = require("./../../db/models/like");
const VerificationToken = require("./../../db/models/verificationToken");
const ResetToken = require("./../../db/models/resetToken");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  generateOTP,
  mailTransport,
  generateEmailTemplate,
  plainEmailTemplate,
  passwordResetTemplate,
} = require("../utils/sendMail");

const { sendErr, creatRandomBytes } = require("../utils/helper");
const { isValidObjectId } = require("mongoose");

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

    const OTP = generateOTP();
    const verificationToken = new VerificationToken({
      owner: newUser._id,
      token: OTP,
    });

    await verificationToken.save();

    await newUser.save();

    mailTransport().sendMail({
      from: "emailVerfication@email.com",
      to: newUser.email,
      subject: "Verify your email account",
      html: generateEmailTemplate(OTP),
    });

    res
      .send(newUser)

      .catch((error) => console.log(error));
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
              expiresIn: "6000m",
            };
            // console.log(result.verified);
            if (!result.verified) {
              return res.status(401).send({
                message: "Pending Account. Please Verify Your Email!",
              });
            }
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

//all verToken
const verTokens = (req, res) => {
  try {
    VerificationToken.find().then((result) => {
      res.status(200).json(result);
    });
  } catch {
    (err) => {
      res.status(400).send(err);
    };
  }
};

//verifyEmail function
const verifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp.trim())
      return sendErr(res, "Invalid req, missing parameter");
    if (!isValidObjectId(userId)) return sendErr(res, "Invalid user id");

    const user = await userModel.findById(userId);
    if (!user) return sendErr(res, "User not found");
    if (user.verified) return sendErr(res, "this account is already verified");

    const token = await VerificationToken.findOne({ owner: user._id });
    if (!token) return sendErr(res, "Token not found");

    const isMatched = await token.compareToken(otp);
    if (!isMatched) sendErr(res, "please provide a valid token!");

    await userModel.findByIdAndUpdate(userId, { verified: true });
    // console.log("here is printing!");
    await VerificationToken.findByIdAndDelete(token._id);
    await userModel().save();
    // console.log("here is not!");

    mailTransport().sendMail({
      from: "emailVerfication@email.com",
      to: user.email,
      subject: "Welcome Email",
      html: plainEmailTemplate(
        "Email is Verified Succefully",
        "Than You For Connecting with us"
      ),
    });

    res.send({
      success: true,
      message: "Your email is verified",
      user: {
        name: user.userName,
        email: user.email,
        id: user._id,
      },
    });
  } catch {
    (err) => {
      res.status(400).send(err);
    };
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return sendErr(res, "Please provide valid email");

  const user = await userModel.findOne({ email });
  if (!user) return sendErr(res, "User not found");

  const token = await ResetToken.findOne({ owner: user._id });
  if (token)
    return sendErr(res, "after one hour you can request for another token!");

  const randomBytes = await creatRandomBytes();
  console.log(randomBytes);
  const resetToken = new ResetToken({ owner: user._id, token: randomBytes });
  await resetToken.save();

  mailTransport().sendMail({
    from: "emailVerfication@email.com",
    to: newUser.email,
    subject: "Verify your email account",
    html: passwordResetTemplate(
      `http://localhost:3000/resetPassword?token=${randomBytes}&id=${user._id}`
    ),
  });
  res.json({
    success: true,
    message: "password reset link is sent to your email.",
  });
};
module.exports = {
  register,
  login,
  users,
  deleteUser,
  verifyEmail,
  verTokens,
  resetPassword,
};
