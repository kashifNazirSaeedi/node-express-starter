const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const knex = require('../db');
const UserModel = require('../db/models/User');
const { JWT_SECRET, JWT_EXPIRY } = process.env;

const login = async (req, res) => {
  try {
    const { email, password } = req.validatedData;

    const isUser = await knex(UserModel.tableName).where({ email }).first();

    if (!isUser) {
      return res.status(400).json({ status: 400, message: 'Invalid Credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, isUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ status: 400, message: 'Invalid Credentials' });
    }

    const token = jwt.sign(
      { id: isUser.id, first_name: isUser.first_name, last_name: isUser.last_name },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRY,
      }
    );

    return res.status(201).json({
      status: 201,
      data: {
        token,
      },
    });
    //
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
};

const signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone_number } = req.validatedData;

    const emailExists = await knex(UserModel.tableName).where({ email }).first();

    if (emailExists) {
      return res.status(400).json({ status: 400, message: 'Email Already Exists' });
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const user = await knex(UserModel.tableName)
      .insert({
        first_name,
        last_name,
        email,
        password: hashPassword,
        phone_number,
      })
      .returning('*');

    return res.status(201).json({
      status: 201,
      data: {
        userId: user[0].id,
      },
    });
    //
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
};

module.exports = {
  login,
  signup,
};
