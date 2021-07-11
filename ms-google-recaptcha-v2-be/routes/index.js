const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const fetch = require("node-fetch");
const dns = require("dns");
const cors = require("cors");
const { route } = require("../app");
const app = express();
app.use(cors());
require("dotenv").config();
const BRANDNAME = process.env.BRAND_NAME;
let transport = null;

if (`${process.env.ENVIRONMENT_SETUP}` === "uat") {
  transport = {
    host: `${process.env.SMTP_HOST}`,
    port: `${process.env.SMTP_PORT}`,

    // // service: `${process.env.SMTP_SERVICE}`,
    // logger: Boolean(`${process.env.LOGGER}`),
    // debug: Boolean(`${process.env.DEBUG}`),
    tls: {
      rejectUnauthorized: false,
    },
  };
} else {
  transport = {
    host: `${process.env.SMTP_HOST}`,
    port: `${process.env.SMTP_PORT}`,
    service: `${process.env.SMTP_SERVICE}`,
    secure: true,
    auth: {
      user: `${process.env.TO_EMAIL}`,
      pass: `${process.env.PASS}`,
    },
  };
}

const transporter = nodemailer.createTransport(transport);

router.post("/contact-us", async (req, res, next) => {
  console.log("contact-us-----------------", req.body);
  const { fullname, customer_email, query, captchaResponse } = req.body;

  if (!captchaResponse) {
    return res.status(400).json({
      msg: "reCAPTCHA is required",
    });
  } else {
    try {
      let googleResponse = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${captchaResponse}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let googleJsonResponse = await googleResponse.json();
      if (!googleJsonResponse.success) {
        return res.status(400).json({
          msg: "reCAPTCHA not verified",
        });
      }
    } catch (ex) {
      console.log("ex === ", ex);
      return res.status(400).json({
        msg: "reCAPTCHA not verified",
      });
    }

    const subject = `Customer Query ${fullname}`;
    const email = process.env.TO_EMAIL;

    const content = `Dear Admin,\n
  Customer name ${fullname} with the email address ${customer_email} has submitted his query on ${BRANDNAME} Website.\n
  ${query}\n

  --------------------------------------------------------------------
  Please do not reply to this email. We can not respond to messages sent to this address.\n

  Thanks.

  Regards,

   Support Team.`;

    const contentType = req.body.contentType; //this variable is used for which type of data transported

    let mail = {
      from: `${process.env.FROM_EMAIL}`,
      to: email,
      subject: subject,
    };

    if (contentType && contentType.length > 0 && contentType === "html") {
      mail = { html: content, ...mail };
    } else {
      mail = { text: content, ...mail };
    }

    transporter.sendMail(mail, (err, data) => {
      try {
        if (err) {
          return res.status(400).json({
            msg: err.message,
          });
        }
        console.log(data);
        return res.status(200).json({
          statusCode: 200,
        });
      } catch (error) {
        console.error(error);
        return res.status(400).json({
          msg: error.message,
        });
      }
    });
  }
});

router.get("/health", (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: `${BRANDNAME} emailer is up and running` });
});

module.exports = router;
