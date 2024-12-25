document.addEventListener("DOMContentLoaded", function () {
    const fileButton = document.querySelector(".button-file");
    const chatWindowContents = document.getElementById("chat-messages");
    const composeChatBox = document.querySelector("#compose-chat-box"); // Reference to the input box

    fileButton.addEventListener("click", function () {
        // Create an input element to allow file selection
        const fileInput = document.createElement("input");
        fileInput.type = "file"; // Accept all file types

        // Trigger the file input click event
        fileInput.click();

        fileInput.onchange = function () {
            const file = fileInput.files[0];
            if (file) {
                // Create a URL for the uploaded file
                const fileURL = URL.createObjectURL(file);
                const fileType = file.type;

                let filePreview = '';

                // Create an appropriate HTML element for the file
                if (fileType.startsWith("image/")) {
                    filePreview = `<img src="${fileURL}" alt="Uploaded Image" class="uploaded-file-preview" style="max-width: 200px; height: auto; border-radius: 5px;">`;
                } else if (fileType.startsWith("video/")) {
                    filePreview = `<video controls class="uploaded-file-preview" style="max-width: 200px; height: auto; border-radius: 5px;">
                                       <source src="${fileURL}" type="${file.type}">
                                       Your browser does not support the video tag.
                                    </video>`;
                } else {
                    // For other file types, display the file name as a link
                    filePreview = `<a href="${fileURL}" download="${file.name}" class="uploaded-file-preview" target="_blank" style="text-decoration: none; color: blue;">
                                     ${file.name}
                                    </a>`;
                }

                // Insert the file preview into the compose chat box (input)
                composeChatBox.value += filePreview; // Add file preview into the input box

                // Automatically scroll to the bottom of the chat window
                chatWindowContents.scrollTop = chatWindowContents.scrollHeight; // Scroll to the bottom
            }
        };
    });
});
