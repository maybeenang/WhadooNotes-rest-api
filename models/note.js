const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const note = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  note: [
    {
      id: {
        type: Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId(),
      },
      title: {
        type: String,
        required: true,
        default: "Untitled",
      },
      description: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
        default: "#CEF1F5",
      },
      date: {
        type: Date,
        default: Date.now,
      },
      isPinned: {
        type: Boolean,
        default: false,
      },
      isArchived: {
        type: Boolean,
        default: false,
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = mongoose.model("Notes", note);
