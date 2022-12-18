// import mongoose
const mongoose = require("mongoose");

module.exports = () => {
  // connect to MongoDB
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
      console.log("Something went wrong");
    });
};
