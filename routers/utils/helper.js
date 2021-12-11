const crypto = require("crypto");

exports.sendErr = (res, error) => {
  res.status(401).json({ success: false, error });
};

exports.creatRandomBytes = () =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) reject(err);

      const token = buff.toString("hex");
      resolve(token);
    });
  });
