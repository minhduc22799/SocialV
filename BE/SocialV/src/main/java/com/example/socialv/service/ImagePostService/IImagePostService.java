package com.example.socialv.service.ImagePostService;

import com.example.socialv.model.ImagePost;
import com.example.socialv.model.Post;
import com.example.socialv.service.IGeneralService;

import java.util.List;

public interface IImagePostService extends IGeneralService<ImagePost> {
    List<ImagePost> findAllByPost(Post post);
    void deleteAllByPost(Post post);
}
