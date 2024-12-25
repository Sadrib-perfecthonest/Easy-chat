const Chat = require("../models/Chat");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join all chat rooms for a user
    socket.on("joinAllChats", async ({ username }) => {
      const chats = await Chat.find({ participants: username });
      chats.forEach((chat) => {
        socket.join(chat.chatName);
        console.log(`${username} joined chat room: ${chat.chatName}`);
      });
    });

    // Send and broadcast messages
    socket.on("sendMessage", async ({ chatName, message }) => {
      try {
        const chat = await Chat.findOne({ chatName });
        console.log(`Message sent to room ${chatName}:`, message);
        if (chat) {
          chat.messages.push(message);
          await chat.save();
        }
        io.to(chatName).emit("receiveMessage", message);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });
  
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};
