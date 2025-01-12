package com.example.demo.controller;

import com.example.demo.model.Message;
import com.example.demo.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        Message response = chatbotService.processUserMessage(userMessage);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<Message>> getChatHistory() {
        List<Message> history = chatbotService.getChatHistory();
        return ResponseEntity.ok(history);
    }
}
