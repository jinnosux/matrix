const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");
const gif = document.getElementById("gif");
const tvOff = document.getElementById("tv-off");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const matrix = letters.split("");
let columns = Math.floor(canvas.width / fontSize);
const drops = Array.from({ length: columns }).fill(1);
const specialDelays = Array(columns).fill(0);
let initialFallDelay = true;
let currentSpecialIndex = 0;
let showingSpecial = false;

console.log("Why are you here?");

// Delay special words appearance for a few seconds
setTimeout(() => {
  initialFallDelay = false;
  showNextSpecialWord();
}, 2000); // 2-second delay

function showNextSpecialWord() {
  if (currentSpecialIndex >= specialWords.length) {
    endSequence();
    return;
  }
  showingSpecial = true;
  setTimeout(() => {
    showingSpecial = false;
    currentSpecialIndex++;
    showNextSpecialWord();
  }, 3500); // Show each special word for 3.5 seconds
}

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    ctx.font = fontSize + "px monospace";
  
    for (let i = 0; i < drops.length; i++) {
      if (specialDelays[i] > 0) {
        specialDelays[i]--;
        continue;
      }
  
      let text;
      let color = "#0F0";
      let wordObj = null;
  
      // Show special words in order after initial delay
      if (
          !initialFallDelay &&
          showingSpecial &&
          Math.random() > (window.innerWidth < 900 ? 0.978 : 0.997) &&
          drops[i] * fontSize < (window.innerWidth < 900 ? canvas.height * 0.7 : canvas.height / 2)
      ) {
        wordObj = specialWords[currentSpecialIndex];
        text = wordObj.text;
        color = "#FFF";
        ctx.shadowColor = "#FFF";
        specialDelays[i] = text.length * 15; // Delay for the length of the special word (increased duration)
      } else {
        text = matrix[Math.floor(Math.random() * matrix.length)];
      }
  
      ctx.fillStyle = color;
      for (let j = 0; j < text.length; j++) {
        ctx.fillText(text[j], i * fontSize, (drops[i] + j) * fontSize);
      }
  
      // Add event listener for click on special words
      if (wordObj && wordObj.url) {
        const x = i * fontSize;
        const yStart = drops[i] * fontSize;
        const yEnd = yStart + text.length * fontSize;
  
        canvas.addEventListener('click', function(event) {
          if (
            event.clientX > x - fontSize / 2 &&
            event.clientX < x + fontSize * 1.5 &&
            event.clientY > yStart - fontSize / 2 &&
            event.clientY < yEnd + fontSize / 2
          ) {
            window.open(wordObj.url, '_blank');
          }
        });
      }
  
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
  
      drops[i]++;
    }
  }
  setInterval(drawMatrix, 50);
  

// Zooming in Effect
let scale = 1;
function zoomMatrix() {
  scale += 0.0002;
  canvas.style.transform = `scale(${scale})`;
  requestAnimationFrame(zoomMatrix);
}
zoomMatrix();

// Adjust canvas size on window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  columns = Math.floor(canvas.width / fontSize);
});

// End sequence after all special words are shown
function endSequence() {
  // Hide canvas
  canvas.style.display = "none";

  // Show GIF
  gif.style.display = "block";

  // After 1 second, hide GIF and show TV Off effect
  setTimeout(() => {
    gif.style.transition = "transform 0.3s ease-in-out, opacity 1s ease-in-out";
    gif.style.transform = "scaleY(0)";
    gif.style.opacity = "0";

    setTimeout(() => {
      gif.style.display = "none";
      tvOff.style.display = "block";

      // the end
      const message = document.createElement("div");
      message.innerText = "You have taken the blue pill. Reality awaits.";
      message.style.position = "absolute";
      message.style.top = "50%";
      message.style.left = "50%";
      message.style.transform = "translate(-50%, -50%)";
      message.style.color = "#FFF";
      message.style.fontSize = "2rem";
      message.style.textAlign = "center";
      tvOff.appendChild(message);
    }, 1000);
  }, 1000);
}
