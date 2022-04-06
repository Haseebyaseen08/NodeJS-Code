const Users = require("../Models/User");
const Validator = require("../Validations/UserValidations");
const uuid = require("uuid");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const roles = ["admin", "student", "teacher"];

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USERNAME, // generated ethereal user
    pass: process.env.MAIL_PASSWORD, // generated ethereal password
  },
});

const register = async (req, res) => {
  //Validate
  const { error } = Validator.registerValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //Check valid role
  if (!roles.includes(req.body.role)) {
    return res.status(400).json({ message: "Invalid role." });
  }

  //Check unique user
  const existingUser = await Users.findOne({ Email: req.body.email });
  if (existingUser) {
    return res.status(400).json({ message: "User Already Exist" });
  }

  //Hashing password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new Users({
    Id: uuid.v1(),
    Name: req.body.name,
    Email: req.body.email,
    Password: hashPassword,
    Age: req.body.age,
    Gender: req.body.gender,
    Role: req.body.role,
    Created: moment.utc(),
  });

  try {
    const hashToken = generateUUID();
    const url = `http://localhost:3000/api/user/EmailConfirmation/${hashToken}`;

    user.VerificationToken = hashToken;
    const createUser = await user.save();
    await transporter.sendMail({
      to: req.body.email,
      subject: "Email Confirmation.",
      html: `Please click link to confirm your email: <a href="${url}">Link</a>`,
    });

    return res.status(200).json(createUser);
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

const login = async (req, res) => {
  //Validate
  const { error } = Validator.loginValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //Check unique user
  const existingUser = await Users.findOne({ Email: req.body.email });
  if (!existingUser) {
    return res.status(400).json({ message: "Email or password is wrong." });
  }

  const validPassword = await bcrypt.compare(
    req.body.password,
    existingUser.Password
  );
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid Password." });
  }

  if (!existingUser.Verified) {
    return res.status(400).json({ message: "Email not verified." });
  }

  const token = jwt.sign({ Id: existingUser.Id }, process.env.TOKEN_SECRET, {
    expiresIn: "1y",
  });
  res.header("Auth-Token", token).status(200).send("LogIn Successful");
};

const emailVerification = async (req, res) => {
  try {
    const user = await Users.findOne({ VerificationToken: req.params.token });

    if (user) {
      updateObject = {
        Verified: true,
        Updated: moment.utc(),
        VerificationToken: null,
      };

      await Users.findOneAndUpdate({ Id: user.Id }, updateObject);

      return res.status(200).send("Email Verified.");
    } else {
      return res.status(400).send("Invalid Request.");
    }
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

const resendEmail = async (req, res) => {
  //Validate
  const { error } = Validator.resendMailValidation(req.query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const user = await Users.findOne({ Email: req.query.email });

    if (user) {

      const hashToken = user.VerificationToken;
      const url = `http://localhost:3000/api/user/EmailConfirmation/${hashToken}`;

      await transporter.sendMail({
        to: req.query.email,
        subject: "Email Re-Confirmation.",
        html: `Please click link to confirm your email: <a href="${url}">Link</a>`,
      });

      return res.status(200).json({message:"Email successfully sent."});
    }

    else{
      return res.status(400).json({message:"Invalid User."});
    }

  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

const generateUUID = () => {
  let d = new Date().getTime(),
    d2 = (performance && performance.now && performance.now() * 1000) || 0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c == "x" ? r : (r & 0x7) | 0x8).toString(16);
  });
};

module.exports = { register, login, emailVerification, resendEmail };
