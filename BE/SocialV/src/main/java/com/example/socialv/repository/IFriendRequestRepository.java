package com.example.socialv.repository;

import com.example.socialv.model.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IFriendRequestRepository extends JpaRepository<FriendRequest, Long> {

}
