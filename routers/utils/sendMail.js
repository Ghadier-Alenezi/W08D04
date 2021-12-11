const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

exports.generateOTP = () => {
  let otp = "";
  for (let i = 0; i < 4; i++) {
    const randomVal = Math.round(Math.random() * 9);
    otp = otp + randomVal;
  }
  return otp;
};

exports.mailTransport = () =>
  nodemailer.createTransport({
    service: process.env.MAILER_SERVICE_PROVIDER,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

exports.generateEmailTemplate = (code) => {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style>
      @media only screen and (max-width: 620px) {
        h1 {
          font-size: 20px;
          padding: 5px;
        }
      }
    </style>
  </head>
  <body>
    <div style="max-width: 620px; margin: 0 auto; font-family: sens-serif">
      <h1 style="padding: 10px; text-align: center">
        We are delighted to welcome you to our website
      </h1>
      <p>Please verify your Email to continue, yout verfication code is:</p>
      <p
        style="
          width: 80px;
          margin: 0 auto;
          font-weight: bold;
          text-align: center;
          border-radius: 5px;
          font-size: 25px;
        "
      >${code}</p>
    </div>
  </body>
</html>

  `;
};

exports.plainEmailTemplate = (heading, message) => {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style>
      @media only screen and (max-width: 620px) {
        h1 {
          font-size: 20px;
          padding: 5px;
        }
      }
    </style>
  </head>
  <body>
    <div style="max-width: 620px; margin: 0 auto; font-family: sens-serif">
      <h1 style="padding: 10px; text-align: center">
        We are delighted to welcome you to our website
      </h1>
      <p>Please verify your Email to continue, yout verfication code is:</p>
      <p
        style="
          width: 80px;
          margin: 0 auto;
          font-weight: bold;
          text-align: center;
          border-radius: 5px;
          font-size: 25px;
        "
      >${code}</p>
    </div>
  </body>
</html>

  `;
};

exports.passwordResetTemplate = (url) => {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style>
      @media only screen and (max-width: 620px) {
        h1 {
          font-size: 20px;
          padding: 5px;
        }
      }
    </style>
  </head>
  <body>
    <div style="max-width: 620px; margin: 0 auto; font-family: sens-serif">
      <h1 style="padding: 10px; text-align: center">
        We are delighted to welcome you to our website
      </h1>
      <p>Please verify your Email to continue, yout verfication code is:</p>
      <p
        style="
          width: 80px;
          margin: 0 auto;
          font-weight: bold;
          text-align: center;
          border-radius: 5px;
          font-size: 25px;
        "
      >${code}</p>
    </div>
  </body>
</html>

  `;
};

exports.plainEmailTemplate = (heading, message) => {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style>
      @media only screen and (max-width: 620px) {
        h1 {
          font-size: 20px;
          padding: 5px;
        }
      }
    </style>
  </head>
  <body>
    <div style="max-width: 620px; margin: 0 auto; font-family: sens-serif">
      <h1 style="padding: 10px; text-align: center">
        We are delighted to welcome you to our website
      </h1>
      <p>Please verify your Email to continue, yout verfication code is:</p>
      <p
        style="
          width: 80px;
          margin: 0 auto;
          font-weight: bold;
          text-align: center;
          border-radius: 5px;
          font-size: 25px;
        "
      >${code}</p>
    </div>
  </body>
</html>

  `;
};
