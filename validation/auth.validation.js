const { body, header } = require("express-validator");

// Token Validation Rule
const tokenValidation = (isRefresh = false) => {
  const tokenType = isRefresh ? "Refresh" : "Access";

  return [
    header("Authorization", `Please provide your ${tokenType} token`)
      .exists()
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        if (!value.startsWith("Bearer") || !value.split(" ")[1]) {
          throw new Error(`Invalid ${tokenType} token`);
        }

        const [, token] = value.split(" ");
        req.headers[isRefresh ? "refresh_token" : "access_token"] = token;

        return true;
      }),
  ];
};

// Validation for user registration
const signupValidation = () => {
  return [
    body("first_name").notEmpty().withMessage("first name should not be empty"),
    body("last_name").notEmpty().withMessage("last name should not be empty"),
    body("email").notEmpty().isEmail().withMessage("Invalid email"),
    body("phone_number").notEmpty().withMessage("Invalid phone number"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("confirm_password")
      .isLength({ min: 6 })
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password do not match");
        }
        return true;
      })
      .withMessage("Password do not match"),
  ];
};

// Validation for user login
const loginValidation = () => [
  body("email", "Invalid email address.")
    .trim()
    .isEmail()
    .custom(async (email, { req }) => {
      const isExist = await fetchUserByEmailOrID(email);
      if (isExist.length === 0)
        throw new Error("Your email is not registered.");
      req.body.user = isExist[0];
      return true;
    }),
  body("password", "Incorrect Password").trim().isLength({ min: 4 }),
];

module.exports = {
  tokenValidation,
  signupValidation,
  loginValidation,
};
