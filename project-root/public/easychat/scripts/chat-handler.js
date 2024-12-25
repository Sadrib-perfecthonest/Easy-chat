// Initially hide the chat window and display the welcome screen
document.getElementById("chat-window").classList.add("hidden");

// Attach click event to each chat tile in the sidebar
const chatTiles = document.querySelectorAll(".chat-tile");
chatTiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    // Hide the welcome screen
    document.getElementById("welcome-screen").classList.add("hidden");
    // Show the chat window
    document.getElementById("chat-window").classList.remove("hidden");
  });
});

const socket = io("http://localhost:5000"); // Connect to the server
let activeChat = ""; // Track the current active chat

// Listen for incoming messages
socket.on("receiveMessage", (message) => {
  // Only update the active chat window
  if (message.chatName === activeChat) {
    displayMessage(message); // Automatically display the new message
  } else {
    // Optionally, you can notify for other chats (e.g., flash the chat tile)
    console.log(`New message in chat: ${message.chatName}`);
  }
});

// Join a chat room
function joinChatRoom(chatName, username) {
  socket.emit("joinRoom", { chatName, username }); // Removed activeChat update here
}

// Send a message
async function sendMessage(chatName, sender, messageText) {
  const message = {
    sender,
    message: messageText,
    time: new Date().toISOString(),
    avatar: `https://picsum.photos/50?random=${sender}`,
  };

  // Emit the message to the server
  socket.emit("sendMessage", { chatName, message });

  // Append the new message to the chat window immediately
  displayMessage(message);
}

// Utility to display a message
function displayMessage(message) {
  const chatMessages = document.getElementById("chat-messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.innerHTML = `
    <img src="${message.avatar}" alt="Avatar" class="avatar">
    <div class="message-content">
      <span class="sender">${message.sender}</span>
      <span class="text">${message.message}</span>
      <span class="time">${new Date(message.time).toLocaleTimeString()}</span>
    </div>
  `;
  chatMessages.appendChild(messageElement);

  // Auto-scroll to the latest message
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Populate the sidebar with available chats
async function populateSidebar(chats) {
  const username = localStorage.getItem("username");

  chats.forEach((chat) => {
    joinChatRoom(chat.chatName, username); // Join all active chat rooms

    const chatTile = document.createElement("div");
    chatTile.classList.add("chat-tile");
    chatTile.innerHTML = `
      <img src="https://picsum.photos/50?random=${chat.chatName}" alt="Avatar" class="chat-tile-avatar">
      <div class="chat-tile-details">
        <div class="chat-tile-title">${chat.chatName}</div>
        <div class="chat-tile-subtitle">Last message: ${
          chat.messages[chat.messages.length - 1]?.text || "No messages yet"
        }</div>
      </div>
    `;
    chatTile.addEventListener("click", () => {
      activeChat = chat.chatName; // Update activeChat here on click
      loadChatWindow(chat.chatName, chat.messages); // Load the chat messages
    });
    document.getElementById("chats-list").appendChild(chatTile);
  });
}

function loadChatWindow(chatName, messages) {
  const chatMessages = document.getElementById("chat-messages");
  chatMessages.innerHTML = ""; // Clear previous messages

  // Display messages from both users in order
  messages.forEach((message) => {
    displayMessage(message); // Display each message in the chat window
  });

  const chatHeader = document.getElementById("active-chat-details");
  chatHeader.querySelector("h3").textContent = chatName; // Set the chat partner's name in the header
  chatHeader.querySelector(".info").textContent = "Active Now"; // Optional status
}
