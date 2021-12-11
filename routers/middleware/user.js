const userModel = require("./../../db/models/user");
const ResetToken = require("./../../db/models/resetToken");

const { isValidObjectId } = require("mongoose");
const { sendErr } = require("../utils/helper");

const isResetTokenValid = async (req, res, next) => {
  try {
    const { token, id } = req.query;
    if (!token || !id) return sendErr(res, "Invalid request!");

    if (!isValidObjectId(id)) return sendErr(res, "Invalid user!");

    const user = await userModel.findById(id);
    if (!user) return sendErr(res, "user not found!");

    const resetToken = await ResetToken.findOneAndRemove({ owner: user._id });
    if (!resetToken) return sendErr(res, "reset token not found!");

    const isValid = await resetToken.compareToken(token);
    if (!isValid) return sendErr(res, "reset token is not valid!");

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = isResetTokenValid;
