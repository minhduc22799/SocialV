package com.example.socialv.dto;

import com.example.socialv.model.PostStatus;
import com.example.socialv.model.Users;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostDisplay {
    private Long id;
    private Users users;
    private String content;
    private Integer countLike;
    private Integer countComment;
    private PostStatus postStatus;
    private LocalDate createAt;
    private boolean checkUserLiked;
}
