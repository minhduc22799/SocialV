package com.example.socialv.service.conversationService;

import com.example.socialv.model.Conversation;
import com.example.socialv.model.Message;
import com.example.socialv.repository.IConversationMemberRepository;
import com.example.socialv.repository.IConversationRepository;
import com.example.socialv.repository.IMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class ConversationService implements IConversationService {

    @Autowired
    private IConversationRepository conversationRepository;
    @Autowired
    private IConversationMemberRepository conversationMemberRepository;
    @Autowired
    private IMessageRepository messageRepository;

    @Override
    public Iterable<Conversation> findAll() {
        return conversationRepository.findAll();
    }

    @Override
    public Optional<Conversation> findById(Long id) {
        Optional<Conversation> conversation = conversationRepository.findById(id);
        conversation.get().setStatus(true);
        save(conversation.get());
        return conversation;
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
        if (conversation.isPresent()) {
            conversation.get().setStatus(true);
            save(conversation.get());
            return conversation.get();
        }
        conversationRepository.createPersonalConversation();
        Conversation conversation1 = conversationRepository.getNewConversation();
        conversationMemberRepository.addMember(conversation1.getId(), id1);
        conversationMemberRepository.addMember(conversation1.getId(), id2);
        return conversation1;
    }

    @Override
    public void createGroupConversation(List<Long> list) {
        conversationRepository.createGroupConversation();
        Conversation conversation1 = conversationRepository.getNewConversation();
        for (Long userId : list) {
            conversationMemberRepository.addMember(conversation1.getId(), userId);
        }
    }

    @Override
    public List<Conversation> getAllPersonalConversation(Long id) {
        List<Conversation> conversations = conversationRepository.getAllPersonalConversation(id);
        List<Message> messages = new ArrayList<>();
        List<Conversation> listSorted = new ArrayList<>();
        for (Conversation conversation : conversations) {
            if (messageRepository.getLatestMessage(conversation.getId()).isPresent()) {
                messages.add(messageRepository.getLatestMessage(conversation.getId()).get());
            }
        }
        Collections.sort(messages, Comparator.comparing(Message::getTextAt).reversed());
        for (Message message : messages) {
            listSorted.add(message.getConversation());
        }
        return listSorted;
    }

    @Override
    public List<Conversation> getAllGroupConversation(Long id) {
        List<Conversation> conversations = conversationRepository.getAllGroupConversation(id);
        List<Conversation> blankConversation = new ArrayList<>();
        List<Message> messages = new ArrayList<>();
        List<Conversation> listSorted = new ArrayList<>();
        for (Conversation conversation : conversations) {
            if (messageRepository.getLatestMessage(conversation.getId()).isPresent()) {
                messages.add(messageRepository.getLatestMessage(conversation.getId()).get());
            } else {
                blankConversation.add(conversation);
            }
        }
        Collections.sort(messages, Comparator.comparing(Message::getTextAt).reversed());
        Collections.reverse(blankConversation);
        for (Message message : messages) {
            listSorted.add(message.getConversation());
        }
        listSorted.addAll(blankConversation);
        return listSorted;
    }
}
