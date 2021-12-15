const userModel = require("./../../db/models/user");
const postModle = require("./../../db/models/post");
const commentModle = require("./../../db/models/comment");
const likeModle = require("./../../db/models/like");
const VerificationToken = require("./../../db/models/verificationToken");
const ResetToken = require("./../../db/models/resetToken");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");

const {
  generateOTP,
  mailTransport,
  generateEmailTemplate,
  plainEmailTemplate,
  passwordResetTemplate,
} = require("../utils/sendMail");

const { sendErr, creatRandomBytes } = require("../utils/helper");
const { isValidObjectId } = require("mongoose");
const { response } = require("express");

require("dotenv").config();

const SALT = Number(process.env.SALT);
const secret = process.env.SECRET_KEY;

const register = async (req, res) => {
  const { userName, email, password, avatar, role } = req.body;
  const savedEmail = email.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, SALT);
  try {
    const existUser = await userModel.findOne({ email: savedEmail }).exec();
    if (existUser) {
      return res.status(409).send({
        message: "Email is already exist!",
      });
    }
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
      from: process.env,EMAIL_USERNAME,
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
    console.log("here is not!");

    mailTransport().sendMail({
      from: process.env.MAILTRAP_USERNAME,
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

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return sendErr(res, "Please provide valid email");

    const user = await userModel.findOne({ email });
    if (!user) return sendErr(res, "User not found");

    const token = await ResetToken.findOne({ owner: user._id });
    if (token)
      return sendErr(res, "after one hour you can request for another token!");
    // console.log("toke,", token);
    const randomBytes = await creatRandomBytes();
    // return console.log("randomBytes", randomBytes);
    const resetToken = new ResetToken({ owner: user._id, token: randomBytes });
    await resetToken.save();

    mailTransport().sendMail({
      from: process.env.MAILTRAP_USERNAME,
      to: user.email,
      subject: "Reset your password",
      html: passwordResetTemplate(
        `http://localhost:3000/resetPassword?token=${randomBytes}&id=${user._id}`
      ),
    });
    res.json({
      success: true,
      message: "password reset link is sent to your email.",
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await userModel.findById(req.user._id);
    if (!user) return sendErr(res, "user not found");

    const isSamePassword = await user.comparePassword(password);
    if (isSamePassword) return sendErr(res, "inter a new password");

    if (password.trim().length < 6 || password.trim().length < 20)
      return sendErr(res, "password must be 6 to 20 characters long!");

    user.password = password.trim();
    await user.save();

    // await ResetToken.findOneAndDelete({ owner: user._id });

    mailTransport().sendMail({
      from: process.env.MAILTRAP_USERNAME,
      to: user.email,
      subject: "Reset your password successfully",
      html: plainEmailTemplate(
        "Password Reset Successfully",
        "Now ypu can login with your new password"
      ),
    });
    res.send({ success: true, message: "Password Reset Successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
};

// log in with google
const client = new OAuth2Client(
  "801305115124-kp5gtb7a2f1ej1e2bgi7gqrh1iio4l9t.apps.googleusercontent.com"
);
const googlelogin = async (req, res) => {
  const { tokenId } = req.body;
  try {
    client
      .verifyIdToken({
        idToken: tokenId,
        audience:
          "801305115124-kp5gtb7a2f1ej1e2bgi7gqrh1iio4l9t.apps.googleusercontent.com",
      })
      .then((res) => {
        const { email_verified, name, email, profileObj } = res.payload;
        console.log(res);
        if (email_verified) {
          userModel.findOne({ email }).exec((err, user) => {
            if (err) {
              return res.status(400).json({
                error: "Somethig went wrong...",
              });
            } else {
              if (user) {
                const options = {
                  expiresIn: "7d",
                };
                const token = jwt.sign(
                  { _id: user._id, role: user.role },
                  process.env.secert_key,
                  options
                );
                const result = {
                  _id: user._idrsz,
                  userName: name,
                  email,
                  role: "61a750d07acff210a70d2b8c",
                };
                res.status(200).json({ result, token });
              } else {
                let password = email + process.env.secert_key;
                const newUser = new userModel({
                  userName: name,
                  password,
                  email,
                  role: "61a750d07acff210a70d2b8c",
                });
                newUser.save((err, data) => {
                  if (err) {
                    return res.status(400).send(err);
                  }
                  console.log(data);
                  const token = jwt.sign(
                    { _id: data._id },
                    process.env.secert_key,
                    {
                      expiresIn: "7d",
                    }
                  );
                  const { _id, name, email, role } = newUser;
                  res.status(200).json({ result: data, token });
                });
              }
            }
          });
        }
      });

    // console.log(tokenId);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  register,
  login,
  users,
  deleteUser,
  verifyEmail,
  verTokens,
  forgetPassword,
  resetPassword,
  googlelogin,
};
