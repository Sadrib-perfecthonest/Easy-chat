document.addEventListener('DOMContentLoaded', function () {
    let isRecording = false;
    let mediaRecorder;
    let audioChunks = [];

    // Function to handle voice recording
    function toggleVoiceRecorder() {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    }

    function startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                isRecording = true;

                // Ensure the chat window footer exists before appending
                const chatWindowFooter = document.querySelector('.chat-window-footer');
                if (chatWindowFooter) {
                    const recordingTimeElement = document.createElement('div');
                    recordingTimeElement.id = 'recording-time';
                    chatWindowFooter.appendChild(recordingTimeElement);

                    // Update the recording time every second
                    let seconds = 0;
                    const timerInterval = setInterval(() => {
                        seconds++;
                        recordingTimeElement.textContent = `Recording: ${seconds}s`;
                    }, 1000);

                    mediaRecorder.onstop = () => {
                        clearInterval(timerInterval);
                        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                        const audioUrl = URL.createObjectURL(audioBlob);
                        sendAudioToInput(audioUrl);  // Send the audio to input box
                        audioChunks = [];
                        isRecording = false;
                        recordingTimeElement.remove(); // Remove the recording time element
                    };
                } else {
                    console.error('chat-window-footer element not found!');
                }

                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };
            })
            .catch(err => {
                console.error("Error accessing audio stream: ", err);
            });
    }

    function stopRecording() {
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
    }

    // Function to send the recorded audio file to the compose input box
    function sendAudioToInput(audioUrl) {
        const composeChatBox = document.querySelector("#compose-chat-box");

        // Create an audio link to insert into the input box
        const audioLink = `<a href="${audioUrl}" download="recorded-audio.wav" style="color: blue; text-decoration: none;">Audio Message</a>`;

        // Insert the audio link into the input box as a value
        composeChatBox.value += audioLink;  // You can customize this as necessary for your chat app

        // Optionally, scroll the input box if needed
        composeChatBox.scrollTop = composeChatBox.scrollHeight;
    }

    // Add event listener to mic button
    const micButton = document.querySelector('.button-mic');
    if (micButton) {
        micButton.addEventListener('click', toggleVoiceRecorder);
    } else {
        console.error('Mic button not found!');
    }
});
