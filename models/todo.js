const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todo = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  todo: [
    {
      id: {
        type: Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId(),
      },
      label: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
        default: "#CEF1F5",
      },
      isCompleted: {
        type: Boolean,
        required: true,
        default: false,
      },
      isDeleted: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ],
});

module.exports = mongoose.model("Todos", todo);
