package com.example.socialv.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    private String content;
    private Integer countLike;
    private Integer countComment;
    @ManyToOne
    @JoinColumn(name = "postStatus_id")
    private PostStatus postStatus;
}
