package com.example.socialv.dto;

import com.example.socialv.model.PostStatus;
import com.example.socialv.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostDisplay {
    private Long id;
    private User user;
    private String content;
    private Integer countLike;
    private Integer countComment;
    private PostStatus postStatus;
    private boolean checkUserLiked;
}
