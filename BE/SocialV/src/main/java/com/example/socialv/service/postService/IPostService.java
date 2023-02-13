package com.example.socialv.service.postService;

import com.example.socialv.model.Post;
import com.example.socialv.model.Users;
import com.example.socialv.service.IGeneralService;

import java.util.List;

public interface IPostService extends IGeneralService<Post> {
    List<Post> findAllFriendPost(Long id);
    List<Post> findAllPersonalPost(Users users);
    List<Post> findAllFriendPublicPost(Long id);
   Iterable<Post> findAllPostByUserIdAndContent(Long id ,String content);
}
