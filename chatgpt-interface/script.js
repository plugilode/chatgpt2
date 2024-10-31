




































































































































































































































































































































const API_KEY = 'OPENAI_API_KEY';
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Initialize conversation history
let conversationHistory = [];

// Function to add a message to the chat
function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to send message to OpenAI API
async function sendToOpenAI(message) {
    try {
        conversationHistory.push({
            role: "user",
            content: message
        });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: conversationHistory,
                max_tokens: 1000
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            const assistantResponse = data.choices[0].message.content;
            conversationHistory.push({
                role: "assistant",
                content: assistantResponse
            });
            return assistantResponse;
        } else {
            throw new Error('Invalid response from OpenAI');
        }
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, there was an error processing your request.';
    }
}

// Handle send button click
async function handleSend() {
    const message = userInput.value.trim();
    if (!message) return;

    // Disable input and button while processing
    userInput.disabled = true;
    sendButton.disabled = true;

    // Add user message to chat
    addMessage(message, true);
    userInput.value = '';

    // Get and add AI response
    const response = await sendToOpenAI(message);
    addMessage(response);

    // Re-enable input and button
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
}

// Event listeners
sendButton.addEventListener('click', handleSend);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

// Initial greeting
addMessage("Hello! I'm ChatGPT by Plugilo. How can I help you today?");