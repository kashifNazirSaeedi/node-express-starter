const express = require('express');
const bodyParser = require('body-parser');
const { updateUserValidationRules } = require('./controller/user.validater');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(updateUserValidationRules());
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
