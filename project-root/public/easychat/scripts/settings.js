document.addEventListener('DOMContentLoaded', function () {
    // Default settings for sounds
    let sendSoundEnabled = true;
    let receiveSoundEnabled = true;

    // File paths for the sounds
    const sendSoundPath = 'file:///D:/East%20Delta%20University/7th%20semester/Chat%20App/Audio/happy-pop-3-185288.mp3';
    const receiveSoundPath = 'file:///D:/East%20Delta%20University/7th%20semester/Chat%20App/Audio/happy-pop-3-185288.mp3';

    // Function to play a sound
    function playSound(url) {
        const audio = new Audio(url);
        audio.play().catch(error => console.error('Error playing sound:', error));
    }

    // Function to display a pop-up
    function showPopup(content, backFunction) {
        const existingPopup = document.getElementById('settings-popup') || document.getElementById('sub-popup');
        if (existingPopup) document.body.removeChild(existingPopup);

        const popup = document.createElement('div');
        popup.id = 'sub-popup';
        popup.style = getPopupStyle();
        popup.innerHTML = content;
        document.body.appendChild(popup);

        document.getElementById('back-to-settings').onclick = function () {
            document.body.removeChild(popup);
            backFunction();
        };
    }

    // Pop-up styling
    function getPopupStyle() {
        return `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            background-color: var(--primary);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            padding: 20px;
            z-index: 1000;
            text-align: center;
        `;
    }

    // Main Settings Popup
    function createSettingsPopup() {
        const popup = document.createElement('div');
        popup.id = 'settings-popup';
        popup.style = getPopupStyle();
        popup.innerHTML = `
            <h2 style="color: white;">Settings</h2>
            <ul style="list-style-type: none; padding: 0;">
                <li><button class="settings-option" id="account-btn">Account</button></li>
                <li><button class="settings-option" id="notifications-btn">Notifications</button></li>
                <li><button class="settings-option" id="privacy-btn">Privacy</button></li>
                <li><button class="settings-option" id="help-btn">Help</button></li>
            </ul>
            <button id="close-settings" style="margin-top: 10px; padding: 5px 10px;">Close</button>
        `;
        document.body.appendChild(popup);

        document.getElementById('close-settings').onclick = () => document.body.removeChild(popup);
        document.getElementById('account-btn').onclick = openAccountSettings;
        document.getElementById('notifications-btn').onclick = openNotificationSettings;
        document.getElementById('privacy-btn').onclick = openPrivacySettings;
        document.getElementById('help-btn').onclick = openHelpSupport;
    }
// Account Settings Popup
// Function to open Account Settings
function openAccountSettings() {
    showPopup(`
        <h2 style="color: white;">Account Settings</h2>
        <form id="account-settings-form">
            <label style="color: white;">Username:</label>
            <input type="text" id="account-username" placeholder="Enter new username" required><br>
            <label style="color: white;">Email:</label>
            <input type="email" id="account-email" placeholder="Enter new email" required><br>
            <label style="color: white;">Password:</label>
            <input type="password" id="account-password" placeholder="Enter new password" required><br>
            <button type="submit" style="margin-top: 10px; padding: 5px 10px;">Update</button>
        </form>
        <button id="back-to-settings" style="margin-top: 10px; padding: 5px 10px;">Back</button>
    `, createSettingsPopup);

    const form = document.getElementById("account-settings-form");
    form.onsubmit = async function (event) {
        event.preventDefault();

        const username = document.getElementById("account-username").value.trim();
        const email = document.getElementById("account-email").value.trim();
        const password = document.getElementById("account-password").value.trim();

        if (!username || !email || !password) {
            alert("All fields are required.");
            return;
        }

        try {
            // Assume logged-in username is stored in localStorage
            const currentUsername = localStorage.getItem("username");
            const response = await fetch("http://localhost:5000/api/user-data/update-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentUsername, username, email, password }),
            });

            if (response.ok) {
                alert("Account updated successfully.");
                localStorage.setItem("username", username); // Update localStorage
                document.getElementById("back-to-settings").click();
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to update account.");
            }
        } catch (error) {
            console.error("Error updating account:", error);
            alert("An error occurred while updating account.");
        }
    };
}


    
    
    // Notification Settings Popup
    function openNotificationSettings() {
        showPopup(`
            <h2 style="color: white;">Notifications</h2>
            <form>
                <label style="color: white;">
                    <input type="checkbox" id="send-sound" ${sendSoundEnabled ? 'checked' : ''}/>
                    Sound While Sending Messages
                </label><br>
                <label style="color: white;">
                    <input type="checkbox" id="receive-sound" ${receiveSoundEnabled ? 'checked' : ''}/>
                    Sound for Incoming Messages
                </label>
            </form>
            <button id="back-to-settings" style="margin-top: 10px; padding: 5px 10px;">Back</button>
        `, createSettingsPopup);

        document.getElementById('send-sound').addEventListener('change', function () {
            sendSoundEnabled = this.checked;
        });

        document.getElementById('receive-sound').addEventListener('change', function () {
            receiveSoundEnabled = this.checked;
        });
    }

    // Attach event listener to the "Settings" button
    document.querySelector('.button-settings').addEventListener('click', createSettingsPopup);

    // Add event listener to the send button for sound playback
    document.querySelector('.button-send').addEventListener('click', function () {
        if (sendSoundEnabled) {
            playSound(sendSoundPath);
        }
    });

    // Simulating incoming messages for sound demonstration
    function simulateIncomingMessage() {
        if (receiveSoundEnabled) {
            playSound(receiveSoundPath);
        }
    }
    // Example: simulate incoming message every 10 seconds
    setInterval(simulateIncomingMessage, 400000);

    // Privacy Settings Popup
    function openPrivacySettings() {
        showPopup(`
            <h2 style="color: white;">Privacy Settings</h2>
            <ul style="list-style-type: none; padding: 0;">
                <li><button class="settings-option" id="profile-photo-btn">Profile Photo</button></li>
                <li><button class="settings-option" id="blocked-contacts-btn">Blocked Contacts</button></li>
            </ul>
            <button id="back-to-settings" style="margin-top: 10px; padding: 5px 10px;">Back</button>
        `, createSettingsPopup);

        document.getElementById('profile-photo-btn').onclick = openProfilePhotoSettings;
        document.getElementById('blocked-contacts-btn').onclick = openBlockedContactsSettings;
    }

    // Profile Photo Settings
    function openProfilePhotoSettings() {
        let privacySetting = 'Public';

        showPopup(`
            <h2 style="color: white;">Profile Photo</h2>
            <form>
                <label style="color: white;">
                    <input type="radio" name="privacy" value="Public" ${privacySetting === 'Public' ? 'checked' : ''} />
                    Public
                </label><br>
                <label style="color: white;">
                    <input type="radio" name="privacy" value="Only Me" ${privacySetting === 'Only Me' ? 'checked' : ''} />
                    Only Me
                </label><br>
                <label style="color: white;">
                    <input type="radio" name="privacy" value="Private" ${privacySetting === 'Private' ? 'checked' : ''} />
                    Private
                </label>
            </form>
            <button id="back-to-settings" style="margin-top: 10px; padding: 5px 10px;">Back</button>
        `, openPrivacySettings);

        document.querySelectorAll('input[name="privacy"]').forEach((input) => {
            input.addEventListener('change', function () {
                privacySetting = this.value;
                alert(`Profile photo privacy set to ${privacySetting}`);
            });
        });
    }

    // Blocked Contacts Settings
    let blockedContacts = [];

    function openBlockedContactsSettings() {
        const listItems = blockedContacts.map(contact => `<li>${contact} <button class="unblock-btn" data-contact="${contact}">Unblock</button></li>`).join('');

        showPopup(`
            <h2 style="color: white;">Blocked Contacts</h2>
            <ul>${listItems}</ul>
            <form>
                <input type="text" id="block-input" placeholder="Enter contact to block" 
                       style="width: 80%; margin-bottom: 10px; padding: 5px; border: 1px solid white; border-radius: 4px;">
                <button type="button" id="block-btn" 
                        style="padding: 5px 10px; border: none; border-radius: 4px; background-color: #4caf50; color: white;">
                    Block
                </button>
            </form>
            <button id="back-to-settings" style="margin-top: 10px; padding: 5px 10px;">Back</button>
        `, openPrivacySettings);

        document.getElementById('block-btn').addEventListener('click', function () {
            const newContact = document.getElementById('block-input').value.trim();
            if (newContact && !blockedContacts.includes(newContact)) {
                blockedContacts.push(newContact);
                localStorage.setItem('blockedContacts', JSON.stringify(blockedContacts));
                alert(`Contact ${newContact} blocked.`);
                updateBlockedContactsList();
            }
        });

        document.querySelectorAll('.unblock-btn').forEach(button => {
            button.addEventListener('click', function () {
                const contactToUnblock = button.getAttribute('data-contact');
                blockedContacts = blockedContacts.filter(contact => contact !== contactToUnblock);
                localStorage.setItem('blockedContacts', JSON.stringify(blockedContacts));
                alert(`Contact ${contactToUnblock} unblocked.`);
                updateBlockedContactsList();
            });
        });
    }

    // Helper function to update the blocked contacts list in the popup
    function updateBlockedContactsList() {
        const listItems = blockedContacts.map(contact => `<li>${contact} <button class="unblock-btn" data-contact="${contact}">Unblock</button></li>`).join('');
        document.querySelector('#blocked-contacts-btn + ul').innerHTML = listItems;
    }

    // Help & Support Popup
    function openHelpSupport() {
        showPopup(`
            <h2 style="color: white;">Help & Support</h2>
            <p style="color: white;">Need help? Contact us at support@example.com.</p>
            <button id="back-to-settings" style="margin-top: 10px; padding: 5px 10px;">Back</button>
        `, createSettingsPopup);
    }
});
