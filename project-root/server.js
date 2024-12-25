require('dotenv').config(); // Load environment variables

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});



// Database connection
connectDB();

// Import routes
const checkUserRoutes = require('./routes/checkUserRoutes');
const authRoutes = require("./routes/authRoutes");
const userDataRoutes = require("./routes/userDataRoutes");
const routes = require("./routes/routes");


app.use((req, res, next) => {
  if (req.url.startsWith("/api")) {
    return next(); 
  }
  next();
});


app.use("/easychat", express.static(path.join(__dirname, "public", "easychat")));

// Route for handling login navigation
app.get("/easychat/login", (req, res) => {
  // Handle logged-in redirection
  if (req.headers.referer === "/easychat/main" && req.headers["cookie"]?.includes("isLoggedIn=true")) {
    return res.redirect("/easychat/main"); // Redirect to main page if already logged in
  }
  res.sendFile(path.join(__dirname, "public", "easychat", "index.html"));
});


app.use("/api/auth", authRoutes);
app.use("/api/user-data", userDataRoutes);
app.use("/api", checkUserRoutes);
app.use(routes);


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "easychat", "index.html"));
});

const chatSocketHandler = require("./sockets/chatSocket");
chatSocketHandler(io);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
