package com.example.socialv.repository;

import com.example.socialv.model.FriendRequest;
import com.example.socialv.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface IFriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    @Query(value = "select * from friend_request where user_request_id = ?1 and user_receive_id = ?2", nativeQuery = true)
Optional<FriendRequest> findFriendRequest(Long id1, Long id2);
}
