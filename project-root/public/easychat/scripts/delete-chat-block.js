document.addEventListener("DOMContentLoaded", () => {
    const deleteChatButton = document.querySelector(".button-Delete-chat");
    const blockButton = document.querySelector(".button-block");
    const loggedInUsername = localStorage.getItem("username");
    let blockedUsers = []; // Cache for blocked users

    // Function to refresh blocked users list from the backend
    async function refreshBlockedUsers() {
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

    // Function to delete chat messages in the chat window
    deleteChatButton.addEventListener("click", async () => {
        const activeChat = document.getElementById("active-chat-details").querySelector("h3").innerText;

        if (!activeChat) {
            alert("No active chat selected.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/user-data/delete-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: loggedInUsername, chatName: activeChat }),
            });

            if (response.ok) {
                // Clear only the chat messages in the chat window
                document.getElementById("chat-messages").innerHTML = "";

                alert(`Messages in the chat with ${activeChat} have been deleted.`);
            } else {
                alert("Failed to delete chat messages. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting chat messages:", error);
        }
    });

    // Function to block a user
    blockButton.addEventListener("click", () => {
        const popupContainer = document.createElement("div");
        popupContainer.id = "block-user-popup";
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
        popupInput.placeholder = "Enter username to block";
        popupInput.style.cssText = "width: 100%; padding: 8px; margin-bottom: 10px;";
        const popupOkButton = document.createElement("button");
        popupOkButton.textContent = "Block";
        popupOkButton.style.cssText = "padding: 8px 15px; margin-right: 5px;";
        const popupCancelButton = document.createElement("button");
        popupCancelButton.textContent = "Cancel";
        popupCancelButton.style.cssText = "padding: 8px 15px;";

        popupContent.append(popupInput, popupOkButton, popupCancelButton);
        popupContainer.appendChild(popupContent);
        document.body.appendChild(popupContainer);

        popupCancelButton.addEventListener("click", () => {
            popupContainer.remove();
        });

        popupOkButton.addEventListener("click", async () => {
            const usernameToBlock = popupInput.value.trim();
            if (!usernameToBlock) {
                alert("Please enter a username.");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/user-data/block-user", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: loggedInUsername, blockUsername: usernameToBlock }),
                });

                if (response.ok) {
                    // Immediately update the frontend
                    // Remove the blocked user from the sidebar
                    const chatTile = document.querySelector(`[data-chatname="${usernameToBlock}"]`);
                    if (chatTile) chatTile.remove();

                    // Clear the chat window if the blocked user was active
                    const activeChatHeader = document.getElementById("active-chat-details").querySelector("h3");
                    if (activeChatHeader && activeChatHeader.innerText === usernameToBlock) {
                        document.getElementById("chat-messages").innerHTML = "";
                        activeChatHeader.innerText = ""; // Clear chat window header
                    }

                    alert(`User "${usernameToBlock}" has been blocked.`);
                    refreshBlockedUsers();
                    popupContainer.remove();
                } else {
                    alert("Failed to block user. Please try again.");
                }
            } catch (error) {
                console.error("Error blocking user:", error);
            }
        });
    });
});

