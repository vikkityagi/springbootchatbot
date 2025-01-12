package com.example.demo.service;

import com.example.demo.model.Message;
import com.example.demo.model.MessageType;
import com.example.demo.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final MessageRepository messageRepository;

    public Message processUserMessage(String userMessage) {
        // Save user message
        Message userMessageEntity = new Message();
        userMessageEntity.setContent(userMessage);
        userMessageEntity.setSender("User");
        userMessageEntity.setMessageType(MessageType.USER);
        messageRepository.save(userMessageEntity);

        // Generate and save bot response
        String botResponse = generateBotResponse(userMessage);
        Message botMessageEntity = new Message();
        botMessageEntity.setContent(botResponse);
        botMessageEntity.setSender("Bot");
        botMessageEntity.setMessageType(MessageType.BOT);
        return messageRepository.save(botMessageEntity);
    }

    public List<Message> getChatHistory() {
        return messageRepository.findAllByOrderByCreatedAtDesc();
    }

    private String generateBotResponse(String userMessage) {
        // Simple response logic - can be enhanced with more sophisticated AI/ML
        userMessage = userMessage.toLowerCase();
        if (userMessage.contains("hello") || userMessage.contains("hi")) {
            return "Hello! How can I help you today?";
        } else if (userMessage.contains("how are you")) {
            return "I'm doing well, thank you for asking! How about you?";
        } else if (userMessage.contains("bye")) {
            return "Goodbye! Have a great day!";
        } else if (userMessage.contains("help")) {
            return "I can help you with basic conversations. Try saying hello!";
        } else {
            return "I'm not sure how to respond to that. Could you please rephrase or ask something else?";
        }
    }
}
