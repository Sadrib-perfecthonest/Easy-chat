// controllers/chatController.js
const Chat = require("../models/Chat");

const getChats = async (req, res) => {
  const chats = await Chat.find();
  res.json(chats);
};

const createChat = async (req, res) => {
  const { chatName } = req.body;
  const chat = new Chat({ chatName, messages: [] });
  await chat.save();
  res.status(201).json({ message: "Chat created." });
};

const addMessage = async (req, res) => {
  const { chatName } = req.params;
  const { sender, message, time, avatar } = req.body;
  const chat = await Chat.findOne({ chatName });
  if (!chat) {
    return res.status(404).json({ message: "Chat not found." });
  }

  chat.messages.push({ sender, message, time, avatar });
  await chat.save();
  res.status(200).json({ message: "Message added." });
};

const deleteChat = async (req, res) => {
  const { chatName } = req.params;
  await Chat.deleteOne({ chatName });
  res.status(200).json({ message: "Chat deleted." });
};

module.exports = { getChats, createChat, addMessage, deleteChat };
