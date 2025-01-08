const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.getElementById('chatbotContainer');
const closeChatbot = document.getElementById('closeChatbot');
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Initialize responses object and file data
let fileData = ''; // Variable to store the content of the text file

// Function to load the .txt file content
async function loadFile() {
  try {
    const response = await fetch('project.txt'); // Replace with the actual path to your txt file
    fileData = await response.text();
  } catch (error) {
    console.error("Error loading file:", error);
    fileData = 'Sorry, I couldn’t load the information at the moment.';
  }
}

// Event listeners for chatbot
chatbotToggle.addEventListener('click', () => {
  chatbotContainer.classList.add('show');
  chatbotContainer.classList.remove('hidden');
});
closeChatbot.addEventListener('click', () => {
  chatbotContainer.classList.add('hidden');
  chatbotContainer.classList.remove('show');
});
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Function to send message
async function sendMessage() {
  const userMessage = userInput.value.trim();
  if (userMessage === '') return;

  addMessage(userMessage, 'user-message');
  const botResponse = await generateResponse(userMessage); // Await async function for file-based responses
  setTimeout(() => addMessage(botResponse, 'bot-message'), 500);
  userInput.value = '';
}

// Function to add messages to the chat
function addMessage(text, className) {
  const message = document.createElement('div');
  message.className = className;
  message.innerHTML = `<p>${text}</p>`;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to generate response based on the .txt file
// Function to generate response based on the .txt file
async function generateResponse(input) {
  input = input.toLowerCase();

  // Search for relevant information from the file
  const response = getFileResponse(input);

  // If response found from the file, return it
  if (response) {
    return response;
  }

  // Handle greetings only if no relevant file response is found
  if (["hi", "hello", "hey", "greetings"].some((greeting) => input.includes(greeting))) {
    return "Hello! How can I assist you today?";
  }

  // Default response if no match found
  return "Sorry, I couldn't find any relevant information in the file.";
}


// Function to search for a response from the file content
function getFileResponse(input) {
  if (!fileData) return;

  // Convert the file data to lowercase and split it into sentences or sections
  const dataLower = fileData.toLowerCase();
  const queryLower = input.toLowerCase();

  // Look for an exact match or substring match from the loaded file
  if (dataLower.includes(queryLower)) {
    // If found, return a snippet of the related content from the file
    const startIndex = dataLower.indexOf(queryLower);
    const snippet = fileData.substring(startIndex, startIndex + 500); // Adjust the snippet length as needed
    return snippet;
  }

  // If no match found in the entire file, return a generic fallback message
  return "Sorry, I couldn't find any relevant information in the file.";
}

// Load the file content when the page is ready
loadFile();
