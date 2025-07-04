// DOM Elements
let saveButton,
  keywordForm,
  canvasBgForm,
  textColorForm,
  textBgForm,
  fontSizeBtns,
  fontToggle;

// Initialize the app
function init() {
  // Cache DOM elements
  saveButton = document.querySelector(".save-btn");
  keywordForm = document.querySelector("#form-keywords");
  canvasBgForm = document.querySelector("#form-canvas-bg");
  textColorForm = document.querySelector("#form-text-fg");
  textBgForm = document.querySelector("#form-text-bg");
  fontSizeBtns = Array.from(document.querySelectorAll(".font-sizes .size"));
  fontToggle = document.querySelector(".font-toggle");

  // Set up event listeners
  setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
  // Download button
  saveButton.addEventListener("click", downloadImage);

  // Form submissions
  keywordForm.addEventListener("submit", handleKeywordSubmit);
  canvasBgForm.addEventListener("submit", handleCanvasBgSubmit);
  textColorForm.addEventListener("submit", handleTextColorSubmit);
  textBgForm.addEventListener("submit", handleTextBgSubmit);

  // Font size buttons
  fontSizeBtns.forEach((btn) => {
    btn.addEventListener("click", handleFontSizeClick);
  });

  // Font toggle button
  fontToggle.addEventListener("click", handleFontToggle);
}

// Handle keyword form submission
function handleKeywordSubmit(event) {
  event.preventDefault();
  const keywordInput = document.querySelector("#input-keyword");
  const keyword = keywordInput.value.trim();
  keywordInput.value = "";
  getWords(keyword);
}

// Handle canvas background form submission
function handleCanvasBgSubmit(event) {
  event.preventDefault();
  const bgColorInput = document.querySelector("#canvas-bg");
  const bgColor = bgColorInput.value.trim();
  if (bgColor) {
    if (isValidHexColor(bgColor)) {
      // Apply hex color directly
      sketchBg = bgColor;
      bgColorInput.value = "";
    } else {
      // Generate color from AI
      generateColor(bgColor, (color) => {
        sketchBg = color;
        bgColorInput.value = "";
      });
    }
  }
}

// Handle text color form submission
function handleTextColorSubmit(event) {
  event.preventDefault();
  const textColorInput = document.querySelector("#text-fg");
  const textColor = textColorInput.value.trim();
  if (activeTileIndex !== null && textColor) {
    if (isValidHexColor(textColor)) {
      // Apply hex color directly
      wordTiles[activeTileIndex].c = textColor;
      textColorInput.value = "";
    } else {
      // Generate color from AI
      generateColor(textColor, (color) => {
        wordTiles[activeTileIndex].c = color;
        textColorInput.value = "";
      });
    }
  }
}

// Handle text background form submission
function handleTextBgSubmit(event) {
  event.preventDefault();
  const textBgInput = document.querySelector("#text-bg");
  const textBg = textBgInput.value.trim();
  if (activeTileIndex !== null && textBg) {
    if (isValidHexColor(textBg)) {
      // Apply hex color directly
      wordTiles[activeTileIndex].bg = textBg;
      textBgInput.value = "";
    } else {
      // Generate color from AI
      generateColor(textBg, (color) => {
        wordTiles[activeTileIndex].bg = color;
        textBgInput.value = "";
      });
    }
  }
}

// Handle font size button clicks
function handleFontSizeClick(e) {
  if (activeTileIndex === null) return;

  // Remove selection from all buttons
  fontSizeBtns.forEach((btn) => btn.classList.remove("selected"));

  // Apply size and select button
  const btn = e.target;
  const sizeMap = {
    XS: 8,
    S: 12,
    M: 16,
    L: 20,
    XL: 24,
  };

  const size = sizeMap[btn.textContent];
  if (size) {
    wordTiles[activeTileIndex].sz = size;
    btn.classList.add("selected");
  }
}

// Handle font toggle button click
function handleFontToggle(e) {
  if (activeTileIndex === null) return;

  const currentTile = wordTiles[activeTileIndex];

  // Toggle between serif and sans-serif
  if (currentTile.font === "serif") {
    currentTile.font = "sans-serif";
    fontToggle.textContent = "Sans-serif";
    fontToggle.classList.remove("serif");
  } else {
    currentTile.font = "serif";
    fontToggle.textContent = "Serif";
    fontToggle.classList.add("serif");
  }
}

// Make request to Ollama for word generation
function getWords(keyword) {
  const model = "mm_mistral";
  const url = API;

  const input = keyword || "mm_filler_words";

  const request = {
    model: model,
    prompt: input,
    stream: false,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then(handleResponse)
    .then(handleWordsData)
    .catch(handleError);
}

// Handle fetch response
function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Handle successful word generation response
function handleWordsData(data) {
  const output = data.response;
  let wordsArray = output.split(",").map((word) => word.trim());

  // Limit to 8 words maximum
  if (wordsArray.length > 8) {
    wordsArray = wordsArray.slice(0, 8);
  }

  appendWords(wordsArray);
}

// Handle API errors
function handleError(error) {
  console.error("Error generating words:", error);
  // Could add user-facing error message here
}

// Validate hex color format
function isValidHexColor(color) {
  // Check if it starts with # and has valid hex format
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

// Generate color from AI using mm_color model
function generateColor(colorDescription, callback) {
  const model = "mm_color";
  const url = API;

  const request = {
    model: model,
    prompt: colorDescription,
    stream: false,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then(handleResponse)
    .then((data) => {
      const hexColor = sanitizeColorResponse(data.response);
      if (hexColor) {
        callback(hexColor);
      } else {
        console.error("Failed to extract valid hex color from AI response");
        // Fallback to a default color
        callback("#000000");
      }
    })
    .catch((error) => {
      console.error("Error generating color:", error);
      // Fallback to a default color
      callback("#000000");
    });
}

// Sanitize AI response to extract only hex color
function sanitizeColorResponse(response) {
  // Remove any whitespace and convert to lowercase
  const cleaned = response.trim().toLowerCase();

  // Look for hex color patterns in the response
  const hexMatch = cleaned.match(/#([a-f0-9]{6}|[a-f0-9]{3})/);

  if (hexMatch) {
    return hexMatch[0]; // Return the matched hex color
  }

  // If no # found, check if the response is just hex digits
  const hexOnlyMatch = cleaned.match(/^([a-f0-9]{6}|[a-f0-9]{3})$/);
  if (hexOnlyMatch) {
    return "#" + hexOnlyMatch[0]; // Add # prefix
  }

  // If no valid hex found, return null
  return null;
}

// Append words to the word palette
function appendWords(wordsArray) {
  const wordsContainer = document.querySelector(".words");

  wordsArray.forEach((word) => {
    if (word.trim()) {
      // Only add non-empty words
      const wordElement = createWordElement(word);
      wordsContainer.appendChild(wordElement);
    }
  });
}

// Create a word element
function createWordElement(word) {
  const wordElement = document.createElement("div");
  wordElement.classList.add("word");
  wordElement.textContent = word;
  wordElement.addEventListener("click", toggleWord);
  return wordElement;
}

// Toggle word selection and add/remove from canvas
function toggleWord(e) {
  const wordElement = e.target;
  const targetHash = wordElement.dataset.hash;

  if (wordElement.classList.contains("used")) {
    // Remove from canvas
    const index = wordTiles.findIndex((tile) => tile.hash === targetHash);
    if (index !== -1) {
      wordTiles.splice(index, 1);
    }
  } else {
    // Add to canvas
    const hash = Date.now().toString();
    wordElement.dataset.hash = hash;

    const newTile = {
      hash: hash,
      text: wordElement.textContent,
      x: width / 2 - 50, // Center with slight offset
      y: height / 2 - 10,
      w: 0,
      h: 0,
      bg: "#000",
      c: "#fff",
      sz: 16,
      font: "sans-serif", // Default font
    };

    wordTiles.push(newTile);
  }

  wordElement.classList.toggle("used");
}

// Update editor interface with selected tile properties
function updateEditor(tile) {
  const textColorInput = document.querySelector("#text-fg");
  const textBgInput = document.querySelector("#text-bg");

  // Update color inputs
  textColorInput.value = tile.c;
  textBgInput.value = tile.bg;

  // Update font size selection
  fontSizeBtns.forEach((btn) => btn.classList.remove("selected"));

  const sizeButtonMap = {
    8: 0, // XS
    12: 1, // S
    16: 2, // M
    20: 3, // L
    24: 4, // XL
  };

  const buttonIndex = sizeButtonMap[tile.sz] || 2; // Default to M
  fontSizeBtns[buttonIndex].classList.add("selected");

  // Update font toggle
  if (tile.font === "serif") {
    fontToggle.textContent = "Serif";
    fontToggle.classList.add("serif");
  } else {
    fontToggle.textContent = "Sans-serif";
    fontToggle.classList.remove("serif");
  }
}

// Clear editor selection
function clearEditor() {
  document.querySelector("#text-fg").value = "";
  document.querySelector("#text-bg").value = "";
  fontSizeBtns.forEach((btn) => btn.classList.remove("selected"));
  fontToggle.textContent = "Sans-serif";
  fontToggle.classList.remove("serif");
}

// Download canvas as image
function downloadImage() {
  // Clear selection before download
  activeTileIndex = null;
  clearEditor();

  // Generate timestamped filename
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);

  saveCanvas(`visual-poetry-${timestamp}`, "png");
}

// Start the app when DOM is ready
document.addEventListener("DOMContentLoaded", init);
