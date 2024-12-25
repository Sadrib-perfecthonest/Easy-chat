document.addEventListener("DOMContentLoaded", async () => {
  const newChatButton = document.querySelector(".button-new-chat");
  const chatsList = document.getElementById("chats-list");
  const chatWindow = document.getElementById("chat-window");
  const welcomeScreen = document.getElementById("welcome-screen");
  const activeChatDetails = document.getElementById("active-chat-details");
  const messagesContainer = document.getElementById("chat-messages");
  const messageInput = document.getElementById("compose-chat-box");
  const sendButton = document.querySelector(".button-send");

  let activeChat = null;
  const messagesCache = new Map();
  let blockedUsers = [];

  const loggedInUsername = localStorage.getItem("username");
  

  async function loadChats() {
    try {
      const response = await fetch(`http://localhost:5000/api/user-data/user-chats/${loggedInUsername}`);
      if (response.ok) {
        const { chats } = await response.json();
        chats.forEach((chat) => {
          createChatTile(chat.chatName);
          messagesCache.set(chat.chatName, chat.messages || []);
        });
      } else {
        console.error("Failed to load chats. Response not OK.");
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  }

  async function saveMessage(chatName, message) {
    try {
      const response = await fetch("http://localhost:5000/api/user-data/save-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loggedInUsername, chatName, messages: [message] }),
      });

      if (response.ok) {
        const { chat } = await response.json();
        messagesCache.set(chatName, chat.messages);
      } else {
        console.error("Failed to save message. Response not OK.");
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  }

  function createChatTile(chatName) {
    const chatTile = document.createElement("div");
    chatTile.classList.add("chat-tile");
    chatTile.setAttribute("data-chatname", chatName);
  
    chatTile.innerHTML = `
      <img src="https://picsum.photos/50?random=${chatName}" alt="Avatar" class="chat-tile-avatar">
      <div class="chat-tile-details">
        <div class="chat-tile-title"><span>${chatName}</span></div>
      </div>`;
    attachChatTileEventListeners(chatTile, chatName);
    chatsList.appendChild(chatTile);
  }
  

  function attachChatTileEventListeners(chatTile, chatName) {
    chatTile.addEventListener("click", async () => {
      if (activeChat !== chatName) {
        activeChat = chatName;
        chatWindow.classList.remove("hidden");
        welcomeScreen.classList.add("hidden");
        activeChatDetails.querySelector("h3").innerText = chatName;
        await fetchAndDisplayMessages(chatName);
      }
    });
  }

  async function fetchAndDisplayMessages(chatName) {
    if (!messagesContainer) {
      console.error("Message container not found.");
      return;
    }

    try {
      if (!messagesCache.has(chatName)) {
        const response = await fetch(`http://localhost:5000/api/user-data/user-chats/${loggedInUsername}`);
        if (response.ok) {
          const { chats } = await response.json();
          const chat = chats.find((c) => c.chatName === chatName);
          if (chat) {
            messagesCache.set(chatName, chat.messages);
          }
        } else {
          console.error("Failed to fetch messages. Response not OK.");
          return;
        }
      }

      renderMessages(messagesCache.get(chatName));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }

  function renderMessages(messages) {
    const messagesContainer = document.getElementById("chat-messages");
    if (!messagesContainer) {
        console.error("Message container not found.");
        return;
    }

    messagesContainer.innerHTML = "";
    if (!messages || messages.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.classList.add("empty-message");
        
        messagesContainer.appendChild(emptyMessage);
        return;
    }

    messages.forEach((msg) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add(
            msg.sender === loggedInUsername ? "sent" : "received",
            "chat-message-container"
        );

        const avatarUrl = `https://picsum.photos/50?random=${msg.sender}`;
        messageElement.innerHTML = `
            <img src="${avatarUrl}" alt="${msg.sender}" class="chat-message-avatar">
            <div class="chat-message">
                <div class="chat-message-sender">${msg.sender}</div>
                <div class="chat-message-content">${msg.message}</div>
                <div class="chat-message-time">${new Date(msg.time).toLocaleTimeString()}</div>
            </div>`;
        messagesContainer.appendChild(messageElement);
    });
}

  sendButton.addEventListener("click", async () => {
    const messageContent = messageInput.value.trim();
    if (!messageContent || !activeChat) return;

    const newMessage = {
      sender: loggedInUsername,
      message: messageContent,
      time: new Date().toISOString(),
    };

    await saveMessage(activeChat, newMessage);
    if (!messagesCache.has(activeChat)) messagesCache.set(activeChat, []);
    const chatMessages = messagesCache.get(activeChat);
    if (!chatMessages.find(msg => msg.message === newMessage.message && msg.time === newMessage.time)) {
      chatMessages.push(newMessage);
    }

    renderMessages(chatMessages);
    messageInput.value = "";
  });

  await loadChats();
  async function fetchBlockedUsers() {
    const loggedInUsername = localStorage.getItem("username");
    try {
        const response = await fetch(`http://localhost:5000/api/user-data/blocked-users/${loggedInUsername}`);
        if (response.ok) {
            blockedUsers = await response.json();
        } else {
            console.error("Failed to fetch blocked users.");
        }
    } catch (error) {
        console.error("Error fetching blocked users:", error);
    }
}

// Refresh blocked users on page load
await fetchBlockedUsers();

  newChatButton.addEventListener("click", () => {
    const popupContainer = document.createElement("div");
    popupContainer.id = "new-chat-popup";
    popupContainer.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background-color: rgba(0, 0, 0, 0.5); display: flex;
      justify-content: center; align-items: center; z-index: 1000;
    `;
    const popupContent = document.createElement("div");
    popupContent.style.cssText = `
      background-color: white; padding: 20px; border-radius: 8px;
      text-align: center; width: 300px;
    `;
    const popupInput = document.createElement("input");
    popupInput.type = "text";
    popupInput.placeholder = "Enter username";
    popupInput.style.cssText = "width: 100%; padding: 8px; margin-bottom: 10px;";
    const popupOkButton = document.createElement("button");
    popupOkButton.textContent = "OK";
    popupOkButton.style.cssText = "padding: 8px 15px; margin-right: 5px;";
    const popupCancelButton = document.createElement("button");
    popupCancelButton.textContent = "Cancel";
    popupCancelButton.style.cssText = "padding: 8px 15px;";
    popupContent.append(popupInput, popupOkButton, popupCancelButton);
    popupContainer.appendChild(popupContent);
    document.body.appendChild(popupContainer);

    popupCancelButton.addEventListener("click", () => {
      popupContainer.style.display = "none";
    });

    popupOkButton.addEventListener("click", async () => {
      const username = popupInput.value.trim();
      if (!username) {
        alert("Please enter a username.");
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/api/check-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });

        if (response.ok) {
          if ([...chatsList.querySelectorAll(".chat-tile")].some(
            (tile) => tile.querySelector(".chat-tile-title span").innerText === username
          )) {
            alert(`The username "${username}" already exists.`);
            return;
          }
          alert(`Chat created for "${username}".`);

          const newChat = { chatName: username, messages: [] };

          const saveChatResponse = await fetch("http://localhost:5000/api/user-data/save-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newChat),
          });

          if (saveChatResponse.ok) {
            createChatTile(username);
            messagesCache.set(username, []);
            popupContainer.style.display = "none";
            popupInput.value = "";
          } else {
            alert("Failed to create the chat. Please try again.");
          }
        } else {
          alert("User does not exist.");
        }
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    });
  });
  
});