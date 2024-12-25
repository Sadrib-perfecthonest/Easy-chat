const express = require("express");

const Chat = require("../models/Chat"); 
const User = require("../models/User"); 
const router = express.Router();

router.post("/save-message", async (req, res) => {
  const { username, chatName, messages } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find or create a chat document
    let chat = await Chat.findOne({ chatName });
    if (!chat) {
      chat = new Chat({
        chatName,
        messages: [],
      });
    }

    // Add new messages to the chat
    if (Array.isArray(messages)) {
      messages.forEach((msg) => {
        if (msg.sender && msg.message) {
          chat.messages.push({
            sender: msg.sender,
            message: msg.message,
            time: msg.time || new Date().toISOString(), 
            avatar: msg.avatar || `https://picsum.photos/50?random=${msg.sender}`, 
          });
        }
      });
    }

    // Save the chat with the new messages
    await chat.save();

    res.status(200).json({ message: "Message saved successfully", chat });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ message: "Server error while saving message" });
  }
});

router.get("/user-chats/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const chats = await Chat.find({
      $or: [
        { "messages.sender": username }, // Messages where the user is the sender
        { chatName: username },           // Chat name as the other user (recipient)
      ]
    });

    // Ensure that chats always return an array, even if there are no messages
    const filteredChats = chats.map((chat) => {
      // Ensure messages is always an array
      const messages = Array.isArray(chat.messages) ? chat.messages : [];

      const lastMessage = messages[messages.length - 1];
      const chatPartner =
        lastMessage && lastMessage.sender === username
          ? chat.chatName
          : lastMessage?.sender || chat.chatName;

      return {
        chatName: chatPartner,
        messages: messages,
      };
    });

    res.status(200).json({ chats: filteredChats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Server error while fetching chats" });
  }
});

router.post("/save-chat", async (req, res) => {
  const { chatName, messages } = req.body;

  try {
    const newChat = new Chat({
      chatName,
      messages: messages || [], 
    });

    await newChat.save();
    res.status(200).json({ message: "Chat saved successfully", chat: newChat });
  } catch (error) {
    console.error("Error saving chat:", error);
    res.status(500).json({ message: "Server error while saving chat" });
  }
});

router.delete("/delete-message", async (req, res) => {
  const { chatName, index } = req.body;

  try {
    // Find the chat by name
    const chat = await Chat.findOne({ chatName });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Validate the index
    if (index < 0 || index >= chat.messages.length) {
      return res.status(400).json({ message: "Invalid message index" });
    }

    // Update the message content to mark it as deleted
    chat.messages[index].message = "Message is deleted";

    // Save the updated chat
    await chat.save();

    res.status(200).json({ message: "Message marked as deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Server error while deleting message" });
  }
});
router.get("/user-info/:username", async (req, res) => {
  const { username } = req.params;
  try {
    // Fetch user information based on the username
    const user = await User.findOne({ username: username });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user information (excluding sensitive data like password)
    const { username: userName, avatar, email } = user;
    res.status(200).json({ username: userName, avatar, email });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const bcrypt = require("bcrypt");

router.post("/update-user", async (req, res) => {
    const { currentUsername, username, email, password } = req.body;

    // Input validation
    if (!currentUsername || !username || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Find the user by their current username
        const user = await User.findOne({ username: currentUsername });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user information
        user.username = username;
        user.email = email;
        user.password = hashedPassword;

        await user.save();

        res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error while updating user." });
    }
});

// Route to delete a chat
router.post("/delete-chat", async (req, res) => {
    const { username, chatName } = req.body;

    try {
        // Delete the chat document from the Chat collection
        await Chat.deleteOne({ chatName });
        res.status(200).json({ message: `Chat with ${chatName} deleted successfully.` });
    } catch (error) {
        console.error("Error deleting chat:", error);
        res.status(500).json({ message: "Failed to delete chat." });
    }
});

// Route to block a user
router.post("/block-user", async (req, res) => {
  const { username, blockUsername } = req.body;

  try {
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ message: "User not found." });

      await User.updateOne(
          { username },
          { $addToSet: { blockedUsers: { username: blockUsername, unblockCount: 0 } } }
      );

      res.status(200).json({ message: `User "${blockUsername}" blocked successfully.` });
  } catch (error) {
      console.error("Error blocking user:", error);
      res.status(500).json({ message: "Failed to block user." });
  }
});

// Route to unblock a user
router.post("/unblock-user", async (req, res) => {
    const { username, unblockUsername } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found." });

        const blockedUser = user.blockedUsers.find((u) => u.username === unblockUsername);
        if (!blockedUser) return res.status(404).json({ message: "Blocked user not found." });

        if (blockedUser.unblockCount >= 2) {
            return res.status(403).json({ message: "Maximum unblock attempts reached." });
        }

        // Increment the unblock count
        await User.updateOne(
            { username, "blockedUsers.username": unblockUsername },
            { $inc: { "blockedUsers.$.unblockCount": 1 } }
        );

        // Optionally, remove from blocked users after unblock count is incremented
        await User.updateOne(
            { username },
            { $pull: { blockedUsers: { username: unblockUsername, unblockCount: 2 } } }
        );

        res.status(200).json({ message: `User ${unblockUsername} unblocked successfully.` });
    } catch (error) {
        console.error("Error unblocking user:", error);
        res.status(500).json({ message: "Failed to unblock user." });
    }
});

// Route to fetch blocked users
router.get("/blocked-users/:username", async (req, res) => {
  const { username } = req.params;

  try {
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ message: "User not found." });

      res.status(200).json(user.blockedUsers || []);
  } catch (error) {
      console.error("Error fetching blocked users:", error);
      res.status(500).json({ message: "Failed to fetch blocked users." });
  }
});


module.exports = router; 