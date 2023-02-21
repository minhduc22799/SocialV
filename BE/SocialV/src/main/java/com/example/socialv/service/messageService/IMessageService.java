package com.example.socialv.service.messageService;

import com.example.socialv.model.Conversation;
import com.example.socialv.model.Message;
import com.example.socialv.service.IGeneralService;

import java.util.List;

public interface IMessageService extends IGeneralService<Message> {
    List<Message> findAllByConversation(Conversation conversation);
}
