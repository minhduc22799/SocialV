package com.example.socialv.service.PostStatusService;

import com.example.socialv.model.PostStatus;
import com.example.socialv.model.Users;
import com.example.socialv.repository.IPostStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PostStatusService implements IPostStatusService{
    @Autowired
    private IPostStatusRepository postStatusRepository;
    @Override
    public Iterable<PostStatus> findAll() {
        return postStatusRepository.findAll();
    }

    @Override
    public Optional<PostStatus> findById(Long id) {
        return postStatusRepository.findById(id);
    }

    @Override
    public void save(PostStatus postStatus) {
    }

    @Override
    public void remove(Long id) {

    }
}
