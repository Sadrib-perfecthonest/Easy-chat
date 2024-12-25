document.addEventListener("DOMContentLoaded", function () {
    const emojiButton = document.querySelector(".button-emoji");
    const popupContainer = document.createElement("div");
    const emojiSelector = document.createElement("div");

    // List of emojis (you can add more emojis if needed)
    const emojiIcons = [
        "😊", "😂", "😍", "🤣", "🙌", "😎", "🥺", "😜", "😢", "😆", "🥳", "😈", "🤩", "😇", "🥰", "😭", "😳",
        "🤔", "🥴", "💩", "🤗", "💖", "❤️", "💀", "👻", "🍕", "🍔", "🍟", "🍿", "🥓", "🥗", "🍩", "🥧", "🥯", "🍣", "🍺"
    ];

    // Setup the popup container (emoji selector)
    popupContainer.classList.add("emoji-popup-container");
    popupContainer.style.position = "absolute";
    popupContainer.style.display = "none";
    popupContainer.style.border = "1px solid #ccc";
    popupContainer.style.padding = "10px";
    popupContainer.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    popupContainer.style.zIndex = "1000";
    popupContainer.style.borderRadius = "5px";
    popupContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
    document.body.appendChild(popupContainer);

    // Setup the emoji selector within the popup
    emojiSelector.classList.add("emoji-selector");
    emojiSelector.style.display = "grid";
    emojiSelector.style.gridTemplateColumns = "repeat(7, 1fr)"; // 7 emojis per row
    emojiSelector.style.gap = "5px";
    emojiSelector.style.justifyItems = "center";
    popupContainer.appendChild(emojiSelector);

    // Populate the emoji selector with emoji icons
    emojiIcons.forEach(function (emoji) {
        const emojiSpan = document.createElement("span");
        emojiSpan.textContent = emoji;
        emojiSpan.style.fontSize = "24px";
        emojiSpan.style.cursor = "pointer";
        emojiSpan.addEventListener("click", function () {
            insertEmoji(emoji);
        });
        emojiSelector.appendChild(emojiSpan);
    });

    // Position the popup container in the bottom-left of the chat window
    const adjustPopupPosition = () => {
        const inputBox = document.querySelector("#compose-chat-box");
        if (inputBox) {
            const rect = inputBox.getBoundingClientRect();
            popupContainer.style.bottom = rect.height + 20 + "px"; // Above the input box
            popupContainer.style.left = "20px"; // Fixed distance from the left edge
            popupContainer.style.width = "300px"; // Set a fixed width for the popup container
        }
    };

    // Show the popup when the emoji button is clicked
    emojiButton.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent event from propagating
        adjustPopupPosition();
        const isVisible = popupContainer.style.display === "block";
        popupContainer.style.display = isVisible ? "none" : "block";
    });

    // Close the popup when clicking outside the button or input box
    document.addEventListener("click", function (e) {
        const inputBox = document.querySelector("#compose-chat-box");
        if (!emojiButton.contains(e.target) && !inputBox.contains(e.target)) {
            popupContainer.style.display = "none"; // Hide popup when clicking outside
        }
    });

    // Function to insert emoji into the input box
    function insertEmoji(emoji) {
        const textInput = document.querySelector("#compose-chat-box");
        if (textInput) {
            textInput.value += emoji; // Insert emoji at the end of the input value
            popupContainer.style.display = "none"; // Hide popup after emoji is selected
        }
    }

    // Optional: Function to send the message (emoji or text)
    const sendButton = document.querySelector(".button-send");
    sendButton.addEventListener("click", function () {
        const messageInput = document.querySelector("#compose-chat-box");
        if (messageInput && messageInput.value.trim() !== "") {
            console.log("Message sent: " + messageInput.value); // For now, just log it to the console
            messageInput.value = ""; // Clear the input after sending the message
        }
    });
});

// Styling for the emoji popup container
const style = document.createElement("style");
style.textContent = `
    .emoji-popup-container {
        width: 300px; /* Width of the emoji popup */
        padding: 10px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.8);
        display: none;
        position: absolute;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    .emoji-selector span {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 5px;
        border-radius: 50%;
        transition: background-color 0.2s;
    }
    .emoji-selector span:hover {
        background-color: #f0f0f0;
    }
`;
document.head.appendChild(style);

