let titleText = "You take the blue pill, the story ends. You wake up in your bed and believe whatever you want to believe. You take the red pill, you stay in Wonderland, and I show you how deep the rabbit hole goes | ";
let scrollSpeed = 100; // Speed in milliseconds

function scrollTitle() {
  document.title = titleText;
  titleText = titleText.substring(1) + titleText.charAt(0);
  setTimeout(scrollTitle, scrollSpeed);
}

scrollTitle();
