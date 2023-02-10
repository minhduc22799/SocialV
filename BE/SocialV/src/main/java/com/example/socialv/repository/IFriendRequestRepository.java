package com.example.socialv.repository;

import com.example.socialv.model.FriendRequest;
import com.example.socialv.model.PostLike;
import com.example.socialv.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IFriendRequestRepository extends JpaRepository<FriendRequest, Long> {

}
