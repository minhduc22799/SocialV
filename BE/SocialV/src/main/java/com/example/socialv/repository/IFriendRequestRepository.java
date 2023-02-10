package com.example.socialv.repository;

import com.example.socialv.model.FriendRequest;
import com.example.socialv.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IFriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    List<User> findFriendRequestsByIdAndStatusTrue(Long id);
}
