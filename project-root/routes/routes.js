const express = require("express");
const path = require("path");
const router = express.Router();

// Middleware for checking login status (you can implement a more secure check if needed)
const checkLoggedIn = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn || false; // You can replace this with localStorage or another method
  if (isLoggedIn) {
    return next();  // Allow access to the next middleware (main content)
  }
  res.redirect("/easychat/login"); // Redirect to login if not logged in
};

// Route for login
router.get("/easychat/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "easychat", "index.html"));
});

// Route for register
router.get("/easychat/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "easychat", "index.html"));
});

// Route for main content (chat) with login check
router.get("/easychat/main", checkLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "easychat", "index.html"));
});

// Fallback route for all other paths to redirect to the login page
router.get("*", (req, res) => {
  res.redirect("/easychat/login");
});

module.exports = router;
