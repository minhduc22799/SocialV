package com.example.socialv.service.FriendRequestService;

import com.example.socialv.model.FriendRequest;
import com.example.socialv.model.User;
import com.example.socialv.repository.IFriendRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FriendRequestService implements IFriendRequestService{
    @Autowired
    private IFriendRequestRepository friendRequestRepository;

    @Override
    public Iterable<FriendRequest> findAll() {
        return null;
    }

    @Override
    public Optional<FriendRequest> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public void save(FriendRequest friendRequest) {

    }

    @Override
    public void remove(Long id) {

    }

    @Override
    public List<User> findFriendRequestsByIdAndStatusTrue(Long id) {
        return friendRequestRepository.findFriendRequestsByIdAndStatusTrue(id);
    }
}
