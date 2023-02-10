package com.example.socialv.dto;

import com.example.socialv.model.PostStatus;
import com.example.socialv.model.User;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PostProperty {
    @JsonProperty("checkUserLiked")
    boolean checkUserLiked;
    @JsonProperty("id")
    Long Id;
    @JsonProperty("user")
    User User;
    @JsonProperty("content")
    String Content;
    @JsonProperty("countLike")
    Integer CountLike;
    @JsonProperty("countComment")
    Integer CountComment;
    @JsonProperty("postStatus")
    PostStatus PostStatus;

    public boolean isCheckUserLiked() {
        return checkUserLiked;
    }

    public void setCheckUserLiked(boolean checkUserLiked) {
        this.checkUserLiked = checkUserLiked;
    }

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public com.example.socialv.model.User getUser() {
        return User;
    }

    public void setUser(com.example.socialv.model.User user) {
        User = user;
    }

    public String getContent() {
        return Content;
    }

    public void setContent(String content) {
        Content = content;
    }

    public Integer getCountLike() {
        return CountLike;
    }

    public void setCountLike(Integer countLike) {
        CountLike = countLike;
    }

    public Integer getCountComment() {
        return CountComment;
    }

    public void setCountComment(Integer countComment) {
        CountComment = countComment;
    }

    public com.example.socialv.model.PostStatus getPostStatus() {
        return PostStatus;
    }

    public void setPostStatus(com.example.socialv.model.PostStatus postStatus) {
        PostStatus = postStatus;
    }
}
