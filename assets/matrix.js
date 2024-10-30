const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");
const gif = document.getElementById("gif");
const tvOff = document.getElementById("tv-off");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const matrix = letters.split("");
let fontSize = window.innerWidth < 900 ? 13 : 17; 
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
}, 3000); // 3-second delay

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
  }, 4000); // Show each special word for 4 seconds
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

    // Show special words in order after initial delay
    if (
        !initialFallDelay &&
        showingSpecial &&
        Math.random() > (window.innerWidth < 900 ? 0.97 : 0.997) && 
        drops[i] * fontSize < (window.innerWidth < 900 ? canvas.height * 0.7 : canvas.height / 2)
      ) {
      text = specialWords[currentSpecialIndex];
      color = "#FFF";
      ctx.shadowColor = "#FFF";
      ctx.shadowBlur = 10;
      specialDelays[i] = text.length * 15; // Delay for the length of the special word (increased duration)
    } else {
      text = matrix[Math.floor(Math.random() * matrix.length)];
      ctx.shadowBlur = 0;
    }

    ctx.fillStyle = color;
    for (let j = 0; j < text.length; j++) {
      ctx.fillText(text[j], i * fontSize, (drops[i] + j) * fontSize);
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
    }, 1000);
  }, 1000);
}
