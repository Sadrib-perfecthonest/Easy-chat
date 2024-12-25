// chat.js

// Function to send the message
// Function to send the message
function sendMessage() {
    // Get the input box and chat window contents
    const messageInput = document.getElementById('compose-chat-box');
    const chatWindowContents = document.getElementById('chat-messages');

    // Get the message value
    const message = messageInput.value.trim();
    const loggedInUser = localStorage.getItem("username"); // Get the logged-in username

    // Check if the message is not empty
    if (message) {
        // Create a new message element
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message-group');

        // Use the correct sender name (logged-in user's username) instead of "You"
        messageElement.innerHTML = `
            <img src="https://picsum.photos/50?random=${loggedInUser}" alt="" class="chat-message-avatar">
            <div class="chat-messages">
                <div class="chat-message-container">
                    <div class="chat-message chat-message-first">
                        <div class="chat-message-sender">${loggedInUser}</div> <!-- Use the logged-in user's username -->
                        ${message}
                        <span class="chat-message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                </div>
            </div>
        `;

        // Append the new message to the chat window contents
        chatWindowContents.appendChild(messageElement);

        // Scroll to the bottom of the chat
        chatWindowContents.scrollTop = chatWindowContents.scrollHeight;

        // Clear the input box
        messageInput.value = '';

        // Optionally, you can store the message in a backend or local storage to persist
        saveMessageToBackend(loggedInUser, message); // Implement this to save messages (if needed)
    }
}

// Attach the function to the send button
document.querySelector('.button-send').onclick = sendMessage;

// Function to persist the message to the backend (optional)
async function saveMessageToBackend(username, message) {
    const chatName = "Abu"; // Example: You can dynamically set the chat name based on the current chat

    try {
        const response = await fetch("http://localhost:5000/api/user-data/save-message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                chatName,
                messages: [
                    {
                        sender: username,
                        message: message,
                        time: new Date().toISOString(),
                        avatar: `https://picsum.photos/50?random=${username}`,
                    },
                ],
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Message saved successfully:", data);
        } else {
            console.error("Error saving message:", response.statusText);
        }
    } catch (error) {
        console.error("Error sending message to backend:", error);
    }
}


