require("dotenv").config();
// import core modules
const express = require("express");
const cors = require("cors");
const app = express();

// import routes
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");
const todoRoutes = require("./routes/todos");

// import database connection
const db = require("./db");

// connect to database
db();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/todos", todoRoutes);

// setting up port
const PORT = process.env.PORT || 3000;

// start express server on port 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
