const { validationResult } = require("express-validator");
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
  const errors = validationResult(req);
  if(!errors.isEmpty())return res.status(400).json({ success: false, errors: errors.array() });
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

const deleteUser = async (req, res) => {
  try 
{
const delUser = await knex(UserModel.tableName).where({ id: req.params.id }).del();

res.send(delUser +"user deleted")

} 
  catch (err) {
  console.error("Error deleting user: \n", err);
  res.status(500).json({ message: "Internal Server Error" });

}


};

const updateUser = async (req, res) => {

  
  const { first_name, last_name, email, password, phone_number } = req.body;
  const userId = req.params.id; 
 
  try {
   const updatedUser = await knex(UserModel.tableName)
     .where({ id: userId })
     .update({ first_name, last_name, email, password, phone_number })
     .returning('*');
   
   if (updatedUser.length > 0) {
     res.status(200).json({ success: true, user: updatedUser[0] });
   } else { 
     res.status(404).json({ success: false, message: 'User not found' });
   }
 
  } catch (error) {
   console.error(error);
   res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
 };
 
module.exports = {
  getUserById,
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
};
