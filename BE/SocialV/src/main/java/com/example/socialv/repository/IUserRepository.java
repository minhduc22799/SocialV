package com.example.socialv.repository;

import com.example.socialv.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IUserRepository extends JpaRepository<User, Long> {
    User findUserByUsername(String username);
    @Query(value = "select * from user join friend_request fr on user.id = fr.user_receive_id " +
            "where fr.user_request_id =?1 and fr.status = true"
            , nativeQuery = true)
    List<User> findFriendRequestsByIdAndStatusTrue(Long id);
}
