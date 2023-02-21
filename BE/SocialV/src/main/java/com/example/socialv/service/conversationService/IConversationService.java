package com.example.socialv.service.conversationService;

import com.example.socialv.model.Conversation;
import com.example.socialv.service.IGeneralService;

import java.util.Optional;

public interface IConversationService extends IGeneralService<Conversation> {
    Conversation findPersonalConversation(Long id1, Long id2);
}
