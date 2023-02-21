package com.example.socialv.repository;

import com.example.socialv.model.Conversation;
import com.example.socialv.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IMessageRepository extends JpaRepository<Message, Long> {
    List<Message> findAllByConversation(Conversation conversation);
}
