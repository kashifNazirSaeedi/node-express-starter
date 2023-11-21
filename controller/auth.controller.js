const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const knex = require("../db");
const UserModel = require("../db/models/User");
const { JWT_SECRET, JWT_EXPIRY } = process.env;

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

    const [userId] = await knex(UserModel.tableName).insert({
      email,
      password: hashPassword,
      first_name,
      last_name,
      phone_number,
    });

    return res.status(200).json({
      status: 20,
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

module.exports = {
  login,
  signup,
};
