const express = require('express');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const app = express();
const PORT = 3000;

app.use(express.json());

// Use the user routes at the '/users' endpoint
app.use('/users', userRoutes);

// Use the authentication routes at the '/auth' endpoint
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
