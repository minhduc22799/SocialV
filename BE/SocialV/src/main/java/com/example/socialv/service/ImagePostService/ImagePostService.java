package com.example.socialv.service.ImagePostService;

import com.example.socialv.model.ImagePost;
import com.example.socialv.model.Post;
import com.example.socialv.model.Users;
import com.example.socialv.repository.IImagePostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class ImagePostService implements IImagePostService{

    @Autowired
    private IImagePostRepository iImagePostRepository;
    @Override
    public Iterable<ImagePost> findAll() {
        return iImagePostRepository.findAll();
    }

    @Override
    public Optional<ImagePost> findById(Long id) {
        return iImagePostRepository.findById(id);
    }

    @Override
    public void save(ImagePost imagePost) {
        iImagePostRepository.save(imagePost);
    }

    @Override
    public void remove(Long id) {
        iImagePostRepository.deleteById(id);
    }

    @Override
    public List<ImagePost> findAllByPost(Post post) {
        return iImagePostRepository.findAllByPost(post);
    }

    @Override
    public void deleteAllByPost(Post post) {
        iImagePostRepository.deleteAllByPost(post);
    }
}
