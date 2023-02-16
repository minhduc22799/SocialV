package com.example.socialv.dto;

import com.example.socialv.model.PostStatus;
import com.example.socialv.model.Users;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostDisplay {
    private Long id;
    private Users users;
    private String content;
    private PostStatus postStatus;
    private LocalDateTime createAt;
    private boolean checkUserLiked;
}
