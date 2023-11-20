const knex = require('../db');
const UserModel = require('../db/models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await knex.select('*').from(UserModel.tableName);

    return res.status(200).json({
      status: 200,
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
};

const createUser = async (req, res) => {
  try {
    let { first_name, last_name, email, password, phone_number } = req.validatedData;

    const user = await knex(UserModel.tableName)
      .insert({
        first_name,
        last_name,
        email,
        password,
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

const getUserById = async (req, res) => {
  try {
    const { id } = req.validatedData;

    const user = await knex.select('*').from(UserModel.tableName).where({ id }).first();

    return res.status(201).json({
      status: 201,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.validatedData;

    await knex(UserModel.tableName).where({ id }).del();

    return res.status(204).json({
      status: 204,
      data: null,
    });
    //
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id, first_name, last_name, phone_number } = req.validatedData;

    await knex(UserModel.tableName)
      .where({ id })
      .update({ first_name, last_name, phone_number });

    return res.status(204).json({
      status: 204,
      data: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
};

module.exports = {
  createUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getUserById,
};
