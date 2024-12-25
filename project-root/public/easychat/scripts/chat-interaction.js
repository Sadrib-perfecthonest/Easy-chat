// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {
	// Select all chat tile title elements
	const chatTitles = document.querySelectorAll('.chat-tile-title');

	// Add a click event listener to each chat tile title
	chatTitles.forEach(title => {
		title.addEventListener("click", function() {
			// Get the chat sender's name and message content
			const senderName = title.querySelector('span').textContent;
			const messageContent = title.closest('.chat-tile').querySelector('.chat-tile-subtitle span').textContent;

			// Update the active chat details section with the sender's name
			const activeChatDetails = document.getElementById('active-chat-details');
			activeChatDetails.textContent = senderName;

			// Update the chat-message chat-message-first with the message content
			const chatMessage = document.querySelector('.chat-message.chat-message-first');
			chatMessage.textContent = messageContent;
		});
	});
});


