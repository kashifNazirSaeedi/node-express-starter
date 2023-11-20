const { validationResult, matchedData } = require('express-validator');

const verifyValidationResult = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.send({ errors: result.array() });
  }

  req.validatedData = matchedData(req);

  next();
};

module.exports = { verifyValidationResult };
