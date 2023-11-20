const bcrypt = require("bcrypt");
const { createHash } = require("crypto");
const { validationResult, matchedData } = require("express-validator");
const { generateToken, verifyToken } = require("../utils/tokenhandler.js");
const knex = require("../db");
const UserModel = require("../db/models/User");

const validation_result = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

const validate = (req, res, next) => {
  const errors = validation_result(req).mapped();
  console.log(req.body);
  if (Object.keys(errors).length) {
    return res.status(422).json({
      status: 422,
      errors,
    });
  }
  next();
};

async function fetchUserByEmailOrID(data, isEmail = true) {
  return knex(UserModel.tableName)
    .select(isEmail ? "*" : ["id", "first_name", "email"])
    .where(isEmail ? { email: data } : { id: data })
    .first();
}

const signup = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.send({ errors: result.array() });
  }

  try {
    const { first_name, last_name, email, password, phone_number } = req.body;

    const emailExists = await knex(UserModel.tableName)
      .where({ email })
      .first();

    if (emailExists) {
      return res
        .status(400)
        .json({ message: `email already exists: ${email}` });
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const [newUser] = await knex(UserModel.tableName)
      .insert({
        first_name,
        last_name,
        email,
        password: hashPassword,
        phone_number,
      })
      .returning("*");

    return res.status(200).json({ userId: newUser.id });
    //
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "xyz",
      user_id: null,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await fetchUserByEmailOrID(email);
    if (!user) {
      return res.status(421).json({
        status: 421,
        message: "Incorrect email!",
      });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);
    console.log(password + "  " + user.password + "  " + verifyPassword);

    if (password != user.password) {
      return res.status(422).json({
        status: 422,
        message: "Incorrect password!",
      });
    }

    /////////////////////////////////////

    const access_token = generateToken({ id: user.id });
    const refresh_token = generateToken({ id: user.id }, false);

    const md5Refresh = createHash("md5").update(refresh_token).digest("hex");

    // Log the md5Refresh to the console for debugging
    console.log("MD5 Refresh Token:", md5Refresh);

    // Save the refresh token to the database
    const [result] = await knex("refresh_tokens").insert({
      user_id: user.id,
      token: md5Refresh,
    });

    if (!result) {
      throw new Error("Failed to whitelist the refresh token.");
    }

    // Log success to the console for debugging
    console.log("Login successful");

    // Continue with the next middleware
    next();
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const accessToken = req.headers.access_token;
    const data = verifyToken(accessToken);

    if (data?.status) return res.status(data.status).json(data);

    const user = await fetchUserByEmailOrID(data.id, false);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    res.json({
      status: 200,
      user,
    });
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.headers.refresh_token;

    // Verify the refresh token
    const data = verifyToken(refreshToken, false);

    if (data?.status) return res.status(data.status).json(data);

    // Converting refresh token to md5 format
    const md5Refresh = createHash("md5").update(refreshToken).digest("hex");

    // Finding the refresh token in the database
    const [refTokenRow] = await knex("refresh_tokens")
      .select("*")
      .where({ token: md5Refresh });

    if (!refTokenRow.length) {
      return res.json({
        status: 401,
        message: "Unauthorized: Invalid Refresh Token.",
      });
    }

    // Generating new access and refresh token
    const access_token = generateToken({ id: data.id });
    const refresh_token = generateToken({ id: data.id }, false);

    const newMd5Refresh = createHash("md5").update(refresh_token).digest("hex");

    // Replacing the old refresh token with the new refresh token
    const [result] = await knex("refresh_tokens")
      .where({ token: md5Refresh })
      .update({ token: newMd5Refresh });

    if (!result) {
      throw new Error("Failed to whitelist the Refresh token.");
    }

    res.json({
      status: 200,
      access_token,
      refresh_token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  validate,
  fetchUserByEmailOrID,
  login,
  signup,
  getUser,
  refreshToken,
};
