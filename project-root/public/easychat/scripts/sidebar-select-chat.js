document.addEventListener("DOMContentLoaded", () => {
    let selectedMessageIndex = null;
  
    // Enable selecting messages in the chat window
    document.getElementById("chat-messages").addEventListener("click", (event) => {
      const messageElement = event.target.closest(".chat-message-container");
      if (!messageElement) return;
  
      // Highlight the selected message
      document
        .querySelectorAll(".chat-message-container.selected")
        .forEach((el) => el.classList.remove("selected"));
      messageElement.classList.add("selected");
  
      // Determine the index of the selected message
      selectedMessageIndex = Array.from(
        document.querySelectorAll(".chat-message-container")
      ).indexOf(messageElement);
    });
  
    // Listen for the Delete key press to delete the selected message
    document.addEventListener("keydown", async (event) => {
      if (event.key === "Delete" && selectedMessageIndex !== null) {
        try {
          const activeChatName = document
            .getElementById("active-chat-details")
            .querySelector("h3").innerText;
  
          // Send a delete request to the backend
          const response = await fetch(`http://localhost:5000/api/user-data/delete-message`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatName: activeChatName, index: selectedMessageIndex }),
          });
  
          if (response.ok) {
            // Update the UI to show "Message is deleted"
            const selectedElement = document.querySelector(
              `.chat-message-container:nth-child(${selectedMessageIndex + 1})`
            );
            if (selectedElement) {
              selectedElement.querySelector(".chat-message-content").innerText =
                "Message is deleted";
            }
  
            // Clear the selection
            selectedMessageIndex = null;
          } else {
            console.error("Failed to delete message. Response not OK.");
          }
        } catch (error) {
          console.error("Error deleting message:", error);
        }
      }
    });
  });
  