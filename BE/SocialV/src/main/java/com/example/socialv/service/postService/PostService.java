package com.example.socialv.service.postService;

import com.example.socialv.dto.PostProperty;
import com.example.socialv.model.Post;
import com.example.socialv.repository.IPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService implements IPostService{
    @Autowired
    private IPostRepository postRepository;

    @Override
    public Iterable<Post> findAll() {
        return postRepository.findAll();
    }

    @Override
    public Optional<Post> findById(Long id) {
        return postRepository.findById(id);
    }

    @Override
    public void save(Post post) {
        postRepository.save(post);
    }


    @Override
    public void remove(Long id) {
        postRepository.deleteById(id);
    }

    @Override
    public List<PostProperty> findAllByUser(Long id) {
        return postRepository.findAllByUser(id);
    }
}
