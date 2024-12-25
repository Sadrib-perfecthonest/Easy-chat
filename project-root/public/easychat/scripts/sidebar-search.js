document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const chatsList = document.getElementById("chats-list"); // The container where chats are listed
    const chatTiles = chatsList.getElementsByClassName("chat-tile"); // Selecting all chat-tile elements

    // Event listener for input on the search field
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase().trim();

        // Loop through all chat tiles and filter based on search query
        Array.from(chatTiles).forEach((tile) => {
            const title = tile.querySelector(".chat-tile-title span");
            
            if (title) {
                const titleText = title.textContent.toLowerCase();

                // Show/hide tiles based on the search query
                if (titleText.includes(query)) {
                    tile.style.display = ""; // Show tile
                } else {
                    tile.style.display = "none"; // Hide tile
                }
            }
        });
    });

    // Optionally, clear search results when the input is blurred
    searchInput.addEventListener("blur", function () {
        if (searchInput.value === "") {
            Array.from(chatTiles).forEach((tile) => {
                tile.style.display = ""; // Show all tiles when search input is cleared
            });
        }
    });
});
