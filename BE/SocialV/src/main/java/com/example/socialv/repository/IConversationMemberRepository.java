package com.example.socialv.repository;

import com.example.socialv.model.ConversationMember;
import com.example.socialv.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface IConversationMemberRepository extends JpaRepository<ConversationMember, Long> {
    @Modifying
    @Query(value = "insert into conversation_member(conversation_id, user_id) values(?1, ?2)", nativeQuery = true)
    void addMember(Long conversationId, Long userId);
}
