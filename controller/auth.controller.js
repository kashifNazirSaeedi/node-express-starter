const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const knex = require("../db");
const UserModel = require("../db/models/User");

const { JWT_SECRET, JWT_EXPIRY, NODEMAILER_USER, NODEMAILER_PASS } =
  process.env;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await knex(UserModel.tableName).where({ email }).first();

    const IsValidPassword = bcrypt.compare(password, user.password);

    if (!user || !IsValidPassword) {
      return res.status(401).json({
        status: 401,
        message: "wrong credentials",
      });
    }
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    return res.status(201).json({
      status: 201,
      data: {
        token,
      },
    });
    //
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

const signup = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone_number } = req.body;

    const existingUser = await knex(UserModel.tableName)
      .where({ email })
      .first();

    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: "User with this email already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    await knex(UserModel.tableName).insert({
      email,
      password: hashPassword,
      first_name,
      last_name,
      phone_number,
    });

    return res.status(200).json({
      status: 200,
      data: {
        message: "User created",
      },
    });
    //
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const resetToken = req.headers.authorization;
    const { newPassword } = req.body;

    const user = await knex(UserModel.tableName)
      .where({ reset_token: resetToken })
      .first();

    if (!user) {
      return res
        .status(404)
        .json({ status: 404, message: "Invalid or expired token" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    await knex(UserModel.tableName).where({ reset_token: resetToken }).update({
      password: hashedPassword,
      reset_token: null,
    });

    return res
      .status(200)
      .json({ status: 200, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

const sendResetEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await knex(UserModel.tableName).where({ email }).first();

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const resetToken = uuidv4();

    await knex(UserModel.tableName)
      .where({ email })
      .update({ reset_token: resetToken });

    const mailOptions = {
      from: "kashifnazir795@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: http://localhost:3000/auth/reset/${resetToken}`,
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASS,
      },
    });

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ status: 500, message: "Error sending reset email" });
      }

      return res
        .status(200)
        .json({ status: 200, message: "Reset email sent successfully" });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

module.exports = {
  login,
  signup,
  resetPassword,
  sendResetEmail,
};
