const knex = require("../db");
const UserModel = require("../db/models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await knex.select("*").from(UserModel.tableName);
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createUser = async (req, res) => {
  try {
    let { first_name, last_name, email, password, phone_number } = req.body;

    const newUser = await knex(UserModel.tableName)
      .insert({
        first_name,
        last_name,
        email,
        password,
        phone_number,
      })
      .returning("*");

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser[0] });
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await knex
      .select("*")
      .from(UserModel.tableName)
      .where({ id: req.params.id })
      .first();

    res.status(200).json(user || {});
  } catch (err) {
    console.error("Error retreiving user: \n", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {};

const updateUser = async (req, res) => {};

module.exports = {
  getUserById,
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
};
