const { body, header } = require('express-validator');

// Token Validation Rule
const tokenValidation = (isRefresh = false) => {
    const tokenType = isRefresh ? 'Refresh' : 'Access';

    return [
        header('Authorization', `Please provide your ${tokenType} token`)
            .exists()
            .not()
            .isEmpty()
            .custom((value, { req }) => {
                if (!value.startsWith('Bearer') || !value.split(' ')[1]) {
                    throw new Error(`Invalid ${tokenType} token`);
                }

                const [, token] = value.split(' ');
                req.headers[isRefresh ? 'refresh_token' : 'access_token'] = token;

                return true;
            }),
    ];
};

// Validation for user registration
const signupValidation = ()=>[
    body('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Name must not be empty.')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long')
        .escape(),
    body('email', 'Invalid email address.')
        .trim()
        .isEmail()
        .custom(async (email) => {
            const isExist = await fetchUserByEmailOrID(email);
            if (isExist.length)
                throw new Error(
                    'A user already exists with this e-mail address'
                );
            return true;
        }),
    body('password')
        .trim()
        .isLength({ min: 4 })
        .withMessage('Password must be at least 4 characters long'),
];

// Validation for user login
const loginValidation = ()=> [
    body('email', 'Invalid email address.')
        .trim()
        .isEmail()
        .custom(async (email, { req }) => {
            const isExist = await fetchUserByEmailOrID(email);
            if (isExist.length === 0)
                throw new Error('Your email is not registered.');
            req.body.user = isExist[0];
            return true;
        }),
    body('password', 'Incorrect Password').trim().isLength({ min: 4 }),
];

module.exports = {
    tokenValidation,
    signupValidation,
    loginValidation,
};
