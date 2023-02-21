package com.example.socialv.controller;

import com.example.socialv.model.Conversation;
import com.example.socialv.model.Message;
import com.example.socialv.service.conversationService.IConversationService;
import com.example.socialv.service.messageService.IMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/chat")
public class ChatController {
    @Autowired
    private IConversationService conversationService;
    @Autowired
    private IMessageService messageService;

    @GetMapping("/room/{id1}/{id2}")
    public ResponseEntity<Conversation> getPersonalConversation(@PathVariable("id1") Long id1, @PathVariable("id2") Long id2){
        return new ResponseEntity<>(conversationService.findPersonalConversation(id1, id2), HttpStatus.OK);
    }

    @GetMapping("/message/{id}")
    public ResponseEntity<List<Message>> getMessage(@PathVariable Long id){
        Conversation conversation = conversationService.findById(id).get();
        List<Message> messages = messageService.findAllByConversation(conversation);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }
}
