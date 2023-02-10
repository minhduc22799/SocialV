package com.example.socialv.service.IPostLikeService;

import com.example.socialv.model.PostLike;
import com.example.socialv.repository.IPostLikeRepository;
import com.example.socialv.repository.IPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PostLikeService implements IPostLikeService {

    @Autowired
    private IPostLikeRepository postLikeRepository;

    @Override
    public Iterable<PostLike> findAll() {
        return null;
    }

    @Override
    public Optional<PostLike> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public void save(PostLike postLike) {

    }

    @Override
    public void remove(Long id) {

    }

    @Override
    public Optional<PostLike> findPostLike(Long userId, Long postId) {
        return postLikeRepository.findPostLike(userId, postId);
    }
}
