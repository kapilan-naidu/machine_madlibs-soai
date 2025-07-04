// DOM Elements
let textDisplay, form, input, button, saveButton;
const MAX_WORDS = 200;

// Initialize the app
function init() {
  textDisplay = document.querySelector(".text-display p");
  form = document.querySelector(".prompt");
  input = document.querySelector(".prompt input");
  button = document.querySelector(".prompt button");
  saveButton = document.querySelector(".save-btn");

  // Initialize with a starting sentence
  getSentence();
  // Handle form submission
  form.addEventListener("submit", handleSubmit);
  // Handle download button
  saveButton.addEventListener("click", downloadText);
  // Check word count on initialization
  checkWordCount();
}

// Handle form submission
function handleSubmit(e) {
  e.preventDefault();
  const userInput = input.value.trim();

  if (userInput) {
    // Add user input to display
    appendToDisplay(`<strong>You:</strong> ${userInput}`);
    // Get AI response
    getSentence(userInput);
    // Clear input
    input.value = "";
  }
}

// Make request from Ollama
function getSentence(userInput) {
  const model = "mm_writer";
  const url = API;

  let prompt;

  if (!userInput) {
    prompt = "mm_writer_start";
  } else {
    // Get the full story context and add the new user input
    const currentStory = htmlContentToStory(textDisplay.innerHTML);
    prompt = currentStory ? `${currentStory} ${userInput}` : userInput;
  }

  const request = {
    model: model,
    prompt: prompt,
    stream: false,
    options: {
      temperature: 0.7,
      max_tokens: 150,
    },
  };

  // Show loading state
  if (userInput) {
    appendToDisplay(`<em>AI is thinking...</em>`);
  }

  // Generate the next sentence
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then(handleResponse)
    .then(handleData)
    .catch(handleError);
}

// Handle fetch response
function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Handle successful data response
function handleData(data) {
  console.log("AI Response:", data.response);
  // Remove loading message if it exists
  removeLastMessage();
  // Add AI response to display
  appendToDisplay(`<strong>AI:</strong> ${data.response}`);
  // Check word count and disable form if necessary
  checkWordCount();
}

// Check word count and disable form if over 200 words
function checkWordCount() {
  const currentStory = htmlContentToStory(textDisplay.innerHTML);
  const wordCount = currentStory.split(/\s+/).filter((word) => word.length > 0).length;

  console.log(`Current word count: ${wordCount}`);

  if (wordCount >= MAX_WORDS) {
    // Disable the form
    input.disabled = true;
    button.disabled = true;
    input.placeholder = "Maximum word count reached";
    // Add visual styling for disabled state
    form.style.opacity = "0.5";
    form.style.pointerEvents = "none";
  } else {
    // Re-enable the form if under 200 words
    input.disabled = false;
    button.disabled = false;
    input.placeholder = "";
    // Remove disabled styling
    form.style.opacity = "1";
    form.style.pointerEvents = "auto";
  }
}

// Handle errors
function handleError(error) {
  console.error("Error:", error);
  // Remove loading message if it exists
  removeLastMessage();
  // Show error message
  appendToDisplay(`<em style="color: red;">Error: ${error.message}</em>`);
}

// Helper function to append text to display
function appendToDisplay(text) {
  const currentContent = textDisplay.innerHTML;
  const separator = currentContent ? "<br><br>" : "";
  textDisplay.innerHTML = currentContent + separator + text;
  // Scroll to bottom
  const textDisplayContainer = document.querySelector(".text-display");
  textDisplayContainer.scrollTop = textDisplayContainer.scrollHeight;
}

// Helper function to remove the last message (for removing loading state)
function removeLastMessage() {
  const content = textDisplay.innerHTML;
  const lastBreakIndex = content.lastIndexOf("<br><br>");
  if (lastBreakIndex !== -1) {
    textDisplay.innerHTML = content.substring(0, lastBreakIndex);
  }
}

// Download text as .txt file
function downloadText() {
  const htmlContent = textDisplay.innerHTML;

  if (!htmlContent.trim()) {
    alert("No text to download!");
    return;
  }

  // Convert HTML to plain text and clean up
  const plainText = htmlContentToStory(htmlContent);

  // Create blob and download
  const blob = new Blob([plainText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  // Create filename with date and time down to seconds
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19); // YYYY-MM-DDTHH-MM-SS

  // Create temporary download link
  const link = document.createElement("a");
  link.href = url;
  link.download = `machine-madlib-${timestamp}.txt`;

  // Trigger download
  document.body.appendChild(link);
  link.click();
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Convert HTML content to clean story text
function htmlContentToStory(htmlContent) {
  // First, remove HTML tags but preserve the structure for parsing
  let cleanedHtml = htmlContent;

  // Replace <br><br> with newlines to preserve separation
  cleanedHtml = cleanedHtml.replace(/<br><br>/g, "\n\n");

  // Create a temporary div to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = cleanedHtml;

  // Get text content and split by double line breaks
  const textContent = tempDiv.textContent || tempDiv.innerText;
  const sections = textContent.split("\n\n").filter((section) => section.trim());

  // Process each section to remove roles and combine into story
  const storyParts = [];

  sections.forEach((section) => {
    const trimmed = section.trim();

    // Skip loading messages and errors
    if (trimmed.includes("AI is thinking...") || trimmed.startsWith("Error:")) {
      return;
    }
    // Remove role prefixes (You: or AI:) - now they come from the HTML content
    let cleaned = trimmed;
    if (cleaned.startsWith("You:")) {
      cleaned = cleaned.substring(4).trim();
    } else if (cleaned.startsWith("AI:")) {
      cleaned = cleaned.substring(3).trim();
    }

    // Add to story if not empty
    if (cleaned.trim()) {
      storyParts.push(cleaned.trim());
    }
  });

  // Join all parts into one cohesive story
  return storyParts.join(" ");
}

// Start the app when DOM is ready
document.addEventListener("DOMContentLoaded", init);
