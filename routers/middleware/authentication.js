const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET_KEY;

const authentication = (req, res, next) => {
  try {
    // console.log(req.headers.authorization);
    if (!req.headers.authorization)
      return res.status(403).json({ message: "forbidden" });
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    const parsedToken = jwt.verify(token, secret);
    // console.log(parsedToken)
    req.token = parsedToken;
    next();
  } catch (error) {
    res.status(404).json(error);
  }
};

module.exports = authentication;
