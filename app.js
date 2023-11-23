const express = require("express");

const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const morgan = require("morgan");

const PORT = 3000;
const app = express();

app.use(express.json());
//app.use(morgan("combined"));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
