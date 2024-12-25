const chatWindowContents = document.getElementById("chat-messages");
const scrollToTopButton = document.querySelector(".scroll-to-top-button");
const scrollToTopButtonIcon = document.querySelector(".scroll-to-top-button-icon");

chatWindowContents.addEventListener("scroll", () => {
  // Check if the user has scrolled to the bottom
  const scrollPositionFromTop = chatWindowContents.scrollTop;
  const scrollFromBottom =
    chatWindowContents.scrollHeight - scrollPositionFromTop - chatWindowContents.clientHeight;

  // Show/hide the scroll-to-top button
  if (scrollFromBottom === 0) {
    scrollToTopButton.classList.add("shrink");
    scrollToTopButtonIcon.classList.add("shrink");
  } else {
    scrollToTopButton.classList.remove("shrink");
    scrollToTopButtonIcon.classList.remove("shrink");
  }
});

scrollToTopButton.addEventListener("click", (event) => {
  event.preventDefault();
  // Scroll to the top of the chat window
  chatWindowContents.scrollTop = 0;
});
