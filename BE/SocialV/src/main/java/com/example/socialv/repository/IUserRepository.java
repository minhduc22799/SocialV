package com.example.socialv.repository;

import com.example.socialv.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IUserRepository extends JpaRepository<Users, Long> {
    Users findUserByUsername(String username);
    @Query(value = "select * from users join friend_request fr on users.id = fr.user_receive_id " +
            "where fr.user_request_id =?1 and fr.status = true"
            , nativeQuery = true)
    List<Users> findFriendRequestsByIdAndStatusTrue(Long id);
}
