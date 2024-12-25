document.addEventListener('DOMContentLoaded', function () {
    const newCommunityButton = document.querySelector('.button-community');
    const sidebarContents = document.getElementById('sidebar-contents');
    const chatsList = document.getElementById('chats-list');
    const chatWindowHeader = document.getElementById('chat-window-header');
    const chatWindowContents = document.getElementById('chat-window-contents');

    // Create and append the popup container
    const popupContainer = document.createElement('div');
    popupContainer.id = 'community-popup';
    popupContainer.style.display = 'none'; // Initially hidden
    popupContainer.style.position = 'fixed';
    popupContainer.style.top = '50%';
    popupContainer.style.left = '50%';
    popupContainer.style.transform = 'translate(-50%, -50%)';
    popupContainer.style.backgroundColor = ' var(--primary)';
    popupContainer.style.padding = '40px';
    
    popupContainer.style.borderRadius = '10px';
    popupContainer.style.zIndex = '1000';
    popupContainer.style.width = '300px';
    popupContainer.style.maxHeight = '80vh';
    popupContainer.style.overflowY = 'auto';

    popupContainer.innerHTML = `
        <div class="popup-content">
            <h3 style="margin-bottom: 10px; color: white;">Create New Community</h3>
            <label for="community-name" style="color: white;">Community Name:</label>
            <input type="text" id="community-name" placeholder="Enter community name" style="width: 100%; margin-bottom: 10px; padding: 5px; ">

            <label for="community-interest" style="color: white;">Community Interest:</label>
            <select id="community-interest" style="width: 100%; margin-bottom: 10px; padding: 5px;">
                <option value="Study">Study</option>
                <option value="Cook">Cook</option>
                <option value="Gaming">Gaming</option>
                <option value="Tech">Tech</option>
                <option value="Fashion">Fashion</option>
                <option value="Personal">Personal</option>
            </select>

            <h4 style="margin-bottom: 10px; color: white;">Add Members:</h4>
            <div id="community-members" style="margin-bottom: 10px;"></div>

            <button id="create-community" style="margin-right: 10px; padding: 5px 10px; border: none; background-color: #007bff; color: white; border-radius: 5px; cursor: pointer;">Create</button>
            <button id="cancel-community" style="padding: 5px 10px; border: none; background-color: #f44336; color: white; border-radius: 5px; cursor: pointer;">Cancel</button>
        </div>
    `;
    document.body.appendChild(popupContainer);

    // Event listener for the "New Community" button
    newCommunityButton.addEventListener('click', function () {
        // Populate members list dynamically from sidebar
        const membersContainer = document.getElementById('community-members');
        membersContainer.innerHTML = ''; // Clear previous entries

        const sidebarUsers = chatsList.querySelectorAll('.chat-tile');
        sidebarUsers.forEach(user => {
            const userTile = document.createElement('div');
            userTile.style.display = 'flex';
            userTile.style.alignItems = 'center';
            userTile.style.marginBottom = '5px';

            const avatar = user.querySelector('.chat-tile-avatar').src;
            const name = user.querySelector('.chat-tile-title span:first-child').innerText;

            userTile.innerHTML = `
                <img src="${avatar}" alt="Avatar" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
                <span style="flex-grow: 1;color: white;">${name}</span>
                <input type="checkbox" class="add-user-checkbox">
            `;
            membersContainer.appendChild(userTile);
        });

        // Show popup
        popupContainer.style.display = 'block';
    });

    // Event listener for the "Cancel" button
    document.getElementById('cancel-community').addEventListener('click', function () {
        popupContainer.style.display = 'none';
    });

    // Event listener for the "Create" button
    document.getElementById('create-community').addEventListener('click', function () {
        const communityName = document.getElementById('community-name').value.trim();
        const communityInterest = document.getElementById('community-interest').value;
        const selectedUsers = [];

        // Get selected users
        const userCheckboxes = document.querySelectorAll('.add-user-checkbox');
        userCheckboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                const user = chatsList.querySelectorAll('.chat-tile')[index];
                selectedUsers.push({
                    name: user.querySelector('.chat-tile-title span:first-child').innerText,
                    avatar: user.querySelector('.chat-tile-avatar').src,
                });
            }
        });

        if (!communityName) {
            alert('Please provide a community name.');
            return;
        }

        if (selectedUsers.length === 0) {
            alert('Please select at least one member.');
            return;
        }

        // Create a new community tile
        const newCommunityTile = document.createElement('div');
        newCommunityTile.classList.add('chat-tile');
        newCommunityTile.innerHTML = `
            <img src="https://picsum.photos/50?random=${Math.random() * 100}" alt="Community Avatar" class="chat-tile-avatar">
            <div class="chat-tile-details">
                <div class="chat-tile-title">
                    <span>${communityName}</span>
                    <span>${communityInterest}</span>
                </div>
                <div class="chat-tile-subtitle">
                    <span>${selectedUsers.map(user => user.name).join(', ')}</span>
                </div>
            </div>
        `;

        // Add event listener for opening the chat window
        newCommunityTile.addEventListener('click', function () {
            chatWindowHeader.querySelector('h3').innerText = communityName;
            chatWindowHeader.querySelector('.info').innerText = `${selectedUsers.length} members`;

            chatWindowContents.innerHTML = `
                <div class="datestamp-container">
                    <span class="datestamp">Community created successfully</span>
                </div>
                <div class="chat-message-group">
                    <div class="chat-messages">
                        <div class="chat-message-container">
                            <div class="chat-message">
                                <strong>Welcome to ${communityName}!</strong>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        // Add the community to the sidebar
        sidebarContents.appendChild(newCommunityTile);

        // Hide popup and reset inputs
        popupContainer.style.display = 'none';
        document.getElementById('community-name').value = '';
        document.getElementById('community-interest').value = 'Study';
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const chatWindowContents = document.getElementById('chat-window-contents');

    // Function to simulate adding a message (user's or others') to the community chat
    function addMessageToChat(sender, message, isCurrentUser = false) {
        const messageGroup = document.createElement('div');
        messageGroup.classList.add('chat-message-group');

        const avatar = document.createElement('img');
        avatar.src = isCurrentUser
            ? 'https://picsum.photos/50?random=2' // User's avatar
            : 'https://picsum.photos/50?random=3'; // Other user's avatar
        avatar.alt = 'Avatar';
        avatar.classList.add('chat-message-avatar');

        const messagesContainer = document.createElement('div');
        messagesContainer.classList.add('chat-messages');

        const messageContainer = document.createElement('div');
        messageContainer.classList.add('chat-message-container');

        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.innerHTML = `
            <strong>${sender}:</strong> ${message}
            <span class="chat-message-time">${new Date().toLocaleTimeString()}</span>
        `;

        // Add delete button if it's the current user's message
        if (isCurrentUser) {
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.style.marginLeft = '10px';
            deleteButton.style.color = 'red';
            deleteButton.style.border = 'none';
            deleteButton.style.background = 'none';
            deleteButton.style.cursor = 'pointer';

            // Event listener to delete the user's own message
            deleteButton.addEventListener('click', function () {
                messageGroup.remove();
                console.log('Message deleted');
            });

            messageElement.appendChild(deleteButton);
        }

        messageContainer.appendChild(messageElement);
        messagesContainer.appendChild(messageContainer);
        messageGroup.appendChild(avatar);
        messageGroup.appendChild(messagesContainer);
        chatWindowContents.appendChild(messageGroup);

        // Scroll to the latest message
        chatWindowContents.scrollTop = chatWindowContents.scrollHeight;
    }

    
});
