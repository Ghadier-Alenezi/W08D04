const crypto = require("crypto");

exports.sendErr = (res, error) => {
  res.status(401).json({ sucess: false, error });
};

exports.creatRandomBytes = () => {
  crypto.randomBytes(
    30,
    (err, buff) =>
      new Promise((resolve, reject) => {
        if (err) return reject(err);

        const token = buff.toString("hex");
        resolve(token);
      })
  );
};
