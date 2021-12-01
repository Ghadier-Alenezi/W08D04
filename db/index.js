const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.DB_URI, options).then(
  () => {
    console.log("DB connected");
  },
  (err) => {
    console.log(err);
  }
);
