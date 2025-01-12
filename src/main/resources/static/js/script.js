document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    // Load chat history when page loads
    loadChatHistory();

    // Send message when send button is clicked
    sendButton.addEventListener('click', sendMessage);

    // Send message when Enter key is pressed
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            // Clear input
            messageInput.value = '';

            // Add user message to chat
            addMessageToChat('user', message);

            // Show typing indicator
            showTypingIndicator();

            // Send message to server
            fetch('/api/chat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            })
            .then(response => response.json())
            .then(data => {
                // Remove typing indicator
                removeTypingIndicator();
                // Add bot response to chat
                addMessageToChat('bot', data.content);
            })
            .catch(error => {
                console.error('Error:', error);
                removeTypingIndicator();
                addMessageToChat('bot', 'Sorry, something went wrong. Please try again.');
            });
        }
    }

    function loadChatHistory() {
        fetch('/api/chat/history')
            .then(response => response.json())
            .then(messages => {
                // Clear existing messages
                chatMessages.innerHTML = '';
                // Add each message to chat
                messages.reverse().forEach(message => {
                    addMessageToChat(
                        message.messageType.toLowerCase(), 
                        message.content,
                        new Date(message.createdAt)
                    );
                });
                scrollToBottom();
            })
            .catch(error => {
                console.error('Error loading chat history:', error);
            });
    }

    function addMessageToChat(type, content, timestamp = new Date()) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = formatTime(timestamp);
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function formatTime(date) {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    }
});
