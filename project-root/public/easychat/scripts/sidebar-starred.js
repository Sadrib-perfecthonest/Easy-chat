document.addEventListener('DOMContentLoaded', function () {
    let selectedMessage = null;
    const chatWindowContents = document.getElementById('chat-window');
    const starredButton = document.querySelector('.button-Starred');
    if (!chatWindowContents || !starredButton) {
        console.error("Required elements not found for 'Starred Messages' functionality.");
        return;
    }
    let starredMessages = new Set(); // Use a Set to avoid duplicates
    let showStarred = false;

    // Event listener for selecting a message
    chatWindowContents.addEventListener('click', function (e) {
        const message = e.target.closest('.chat-message, .chat-message-first');
        if (message) {
            if (selectedMessage) {
                selectedMessage.classList.remove('highlighted');
            }
            selectedMessage = message;
            selectedMessage.classList.add('highlighted');
        }
    });

    // Event listener for the Starred Messages button
    starredButton.addEventListener('click', function () {
        if (selectedMessage) {
            const messageContent = selectedMessage.querySelector('.chat-message-content')?.innerText;
            if (!messageContent) {
                console.error("Unable to star message: Message content not found.");
                return;
            }

            if (selectedMessage.classList.contains('starred')) {
                selectedMessage.classList.remove('starred');
                starredMessages.delete(messageContent);
            } else {
                selectedMessage.classList.add('starred');
                starredMessages.add(messageContent);
            }
            selectedMessage.classList.remove('highlighted');
            selectedMessage = null;
        }

        // Toggle visibility between all and starred messages
        showStarred = !showStarred;
        toggleStarredMessages();
    });

    // Function to toggle visibility of messages
    function toggleStarredMessages() {
        const allMessages = chatWindowContents.querySelectorAll('.chat-message, .chat-message-first');
        allMessages.forEach(function (message) {
            if (showStarred) {
                message.style.display = message.classList.contains('starred') ? 'block' : 'none';
            } else {
                message.style.display = 'block';
            }
        });
    }
});
