package com.example.socialv.service.postService;

import com.example.socialv.dto.PostProperty;
import com.example.socialv.model.Post;
import com.example.socialv.service.IGeneralService;

import java.util.List;

public interface IPostService extends IGeneralService<Post> {
    List<PostProperty> findAllByUser(Long id);
}
