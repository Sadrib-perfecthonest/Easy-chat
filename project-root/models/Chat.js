// models/Chat.js
const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  chatName: { type: String, required: true },
  messages: [
    {
      sender: String,
      message: String,
      time: String,
      avatar: String,
    },
  ],
});

module.exports = mongoose.model("Chat", ChatSchema);
