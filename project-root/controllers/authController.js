const jwt = require('jsonwebtoken'); 
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Chat = require("../models/Chat");
const Community = require("../models/Community");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Validation: Check required fields
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required." });
  }

  try {
    // Check for existing user by username or email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists." });
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the user
    const user = new User({
      username,
      email,
      password: hashedPassword, // Store the hashed password
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validation: Check required fields
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Fetch the user's chats and communities
    const chats = await Chat.find({ userId: user._id });
    const communities = await Community.find({ userId: user._id });

    // If login is successful, return user details, chats, and communities
    res.status(200).json({
      message: "Login successful.",
      user: { username: user.username },
      chats,
      communities,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { registerUser, loginUser };


