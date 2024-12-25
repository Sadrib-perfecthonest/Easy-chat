document.addEventListener('DOMContentLoaded', () => {
    const buttonContact = document.querySelector('.button-contact');
    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');
    document.body.appendChild(popupContainer);

    // Make sure username is retrieved correctly before adding event listeners
    const username = localStorage.getItem('username'); // Replace with the method to get the username
    
    if (!username) {
        console.error('Username not found');
        return;
    }

    buttonContact.addEventListener('click', async () => {
        popupContainer.style.display = 'block';

        // Apply the styles directly in the JS for the popup container
        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '50%';
        popupContainer.style.left = '50%';
        popupContainer.style.transform = 'translate(-50%, -50%)';
        popupContainer.style.backgroundColor = 'black';
        popupContainer.style.borderRadius = '10px';
        popupContainer.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        popupContainer.style.padding = '20px';
        popupContainer.style.zIndex = '9999';
        popupContainer.style.maxWidth = '400px';
        popupContainer.style.width = '100%';

        try {
            // Construct the URL dynamically with the username
            const response = await fetch(`http://localhost:5000/api/user-data/user-info/${username}`);
            
            if (!response.ok) {
                throw new Error('User data not found');
            }

            const userData = await response.json();

            // Extract the relevant data
            const { username: userName, avatar, email } = userData;

            // Populate the popup with user data
            popupContainer.innerHTML = `
    <div class="popup-content" style="color: white;">
        <h2>Contact Information</h2>
        <div class="user-info">
            <img src="https://picsum.photos/50" alt="${userName}'s Avatar" class="user-avatar" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
            <p><strong>Username:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${email}</p>
        </div>
        <p class="security-message">Your messages are encrypted for your safety.</p>
        <button class="close-popup" style="background-color: #f44336; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;margin-top: 20px">Close</button>
    </div>
`;

            const closeButton = popupContainer.querySelector('.close-popup');
            closeButton.addEventListener('click', () => {
                popupContainer.style.display = 'none';
            });
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    });
});
