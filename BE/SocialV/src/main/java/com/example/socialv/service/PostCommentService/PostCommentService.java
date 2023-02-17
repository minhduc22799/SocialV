package com.example.socialv.service.PostCommentService;

import com.example.socialv.model.Post;
import com.example.socialv.model.PostComment;
import com.example.socialv.model.Users;
import com.example.socialv.repository.ICommentLikeRepository;
import com.example.socialv.repository.IPostCommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostCommentService implements IPostCommentService{
    @Autowired
    private IPostCommentRepository postCommentRepository;
    @Autowired
    private ICommentLikeRepository commentLikeRepository;
    @Override
    public Iterable<PostComment> findAll() {
        return null;
    }

    @Override
    public Optional<PostComment> findById(Long id) {
        return postCommentRepository.findById(id);
    }

    @Override
    public void save(PostComment postComment) {
        postCommentRepository.save(postComment);
    }

    @Override
    public void remove(Long id) {
        PostComment  comment = findById(id).get();
        commentLikeRepository.deleteAllByComment(comment);
        postCommentRepository.deleteById(id);
    }

    @Override
    public Integer countPostComment(Long postId) {
        return postCommentRepository.countPostComment(postId);
    }

    @Override
    public List<PostComment> findAllByPost(Post post) {
        return postCommentRepository.findAllByPost(post);
    }

    @Override
    public void deleteAllByPost(Post post) {
        for (PostComment postComment: findAllByPost(post)){
            commentLikeRepository.deleteAllByComment(postComment);
        }
        postCommentRepository.deleteAllByPost(post);
    }
}
