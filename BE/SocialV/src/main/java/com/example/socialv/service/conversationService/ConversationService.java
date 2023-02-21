package com.example.socialv.service.conversationService;

import com.example.socialv.model.Conversation;
import com.example.socialv.repository.IConversationMemberRepository;
import com.example.socialv.repository.IConversationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
public class ConversationService implements IConversationService{

    @Autowired
    private IConversationRepository conversationRepository;
    @Autowired
    private IConversationMemberRepository conversationMemberRepository;

    @Override
    public Iterable<Conversation> findAll() {
        return conversationRepository.findAll();
    }

    @Override
    public Optional<Conversation> findById(Long id) {
        return conversationRepository.findById(id);
    }

    @Override
    public void save(Conversation conversation) {
        conversationRepository.save(conversation);
    }

    @Override
    public void remove(Long id) {
        conversationRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Conversation findPersonalConversation(Long id1, Long id2) {
        Optional<Conversation> conversation = conversationRepository.findPersonalConversation(id1, id2);
        if (conversation.isPresent()){
            return conversation.get();
        }
        conversationRepository.createPersonalConversation();
        Conversation conversation1 = conversationRepository.getNewConversation();
        conversationMemberRepository.addMember(conversation1.getId(), id1);
        conversationMemberRepository.addMember(conversation1.getId(), id2);
        return conversation1;
    }
}
