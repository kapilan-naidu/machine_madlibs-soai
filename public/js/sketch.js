// Global variables for p5.js canvas
const wordTiles = [];
let activeTileIndex = null;
let sketchBg;
let isDragging = false;
let offsetX, offsetY;

// p5.js setup function
function setup() {
  const parentElement = document.querySelector(".preview");
  let parentWidth = parentElement.clientWidth;
  let parentHeight = parentElement.clientHeight;
  let canvasSize = Math.min(parentWidth, parentHeight);

  let canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent(parentElement);

  sketchBg = color(230);
  background(sketchBg);
}

// p5.js draw function
function draw() {
  background(sketchBg);

  for (let i = 0; i < wordTiles.length; i++) {
    const tile = wordTiles[i];

    // Set font family based on tile font property
    if (tile.font === "serif") {
      textFont("Georgia");
    } else {
      textFont("Arial");
    }

    textSize(tile.sz);
    textAlign(CENTER, CENTER);

    let textWidthValue = textWidth(tile.text);
    let textHeightValue = tile.sz * 1.2;
    const padding = 20;

    tile.w = textWidthValue + padding;
    tile.h = textHeightValue + padding;

    // Draw tile background
    fill(tile.bg);
    if (i === activeTileIndex) {
      stroke("#ff3b5b");
      strokeWeight(2);
    } else {
      noStroke();
    }
    rect(tile.x, tile.y, tile.w, tile.h);

    // Draw text
    fill(tile.c);
    noStroke();
    text(tile.text, tile.x + tile.w / 2, tile.y + tile.h / 2);
  }
}

// p5.js mouse interaction functions
function mousePressed() {
  // Check if mouse is within canvas bounds
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return;
  }

  // Start from the top-most tile and check if mouse is within bounds
  for (let i = wordTiles.length - 1; i >= 0; i--) {
    const tile = wordTiles[i];
    if (
      mouseX > tile.x &&
      mouseX < tile.x + tile.w &&
      mouseY > tile.y &&
      mouseY < tile.y + tile.h
    ) {
      activeTileIndex = i;
      isDragging = true;
      // Calculate offset for smooth dragging
      offsetX = mouseX - tile.x;
      offsetY = mouseY - tile.y;
      // Update editor with current tile properties
      updateEditor(wordTiles[activeTileIndex]);
      return;
    }
  }

  // If no tile was clicked, clear selection
  activeTileIndex = null;
  clearEditor();
}

function mouseDragged() {
  if (isDragging && activeTileIndex !== null) {
    const tile = wordTiles[activeTileIndex];
    // Update tile position, keeping it within canvas bounds
    tile.x = Math.max(0, Math.min(width - tile.w, mouseX - offsetX));
    tile.y = Math.max(0, Math.min(height - tile.h, mouseY - offsetY));
  }
}

function mouseReleased() {
  isDragging = false;
}

function doubleClicked() {
  // Clear selection on double click in empty area
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    activeTileIndex = null;
    clearEditor();
  }
}
