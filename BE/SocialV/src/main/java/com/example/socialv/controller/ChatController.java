package com.example.socialv.controller;

import com.example.socialv.model.Conversation;
import com.example.socialv.model.Message;
import com.example.socialv.model.Users;
import com.example.socialv.service.conversationService.IConversationService;
import com.example.socialv.service.messageService.IMessageService;
import com.example.socialv.service.userService.IUserService;
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
    @Autowired
    private IUserService userService;

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

    @PostMapping
    public ResponseEntity<?> createMessage(@RequestBody Message message){
        messageService.save(message);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/group")
    public ResponseEntity<?> createGroupChat(@RequestBody List<Long> userId){
        conversationService.createGroupConversation(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/room/{id}")
    public ResponseEntity<List<Conversation>> getAllPersonalConversation(@PathVariable Long id){
        return new ResponseEntity<>(conversationService.getAllPersonalConversation(id), HttpStatus.OK);
    }
    @GetMapping("/room/group/{id}")
    public ResponseEntity<List<Conversation>> getAllGroupConversation(@PathVariable Long id){
        return new ResponseEntity<>(conversationService.getAllGroupConversation(id), HttpStatus.OK);
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<List<Users>> searchFriend(@PathVariable Long id, @RequestParam("q") String search){
        return new ResponseEntity<>(userService.findInListFriend(id, search), HttpStatus.OK);
    }
}
