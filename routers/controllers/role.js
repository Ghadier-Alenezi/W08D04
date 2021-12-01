const roleModel = require("./../../db/models/role");

const newRole = (req, res) => {
  const { role, Permissions } = req.body;
  const newRole = new roleModel({
    role,
    Permissions,
  });
  newRole
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const roles = (req, res) => {
  roleModel
    .find({})
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

module.exports = { newRole, roles };