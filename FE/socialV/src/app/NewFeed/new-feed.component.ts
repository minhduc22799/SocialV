import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {PostDisplay} from "../Model/Post-display";
import {PostService} from "../PostService/post.service";
import {UserService} from "../service/user.service";
import {Users} from "../Model/Users";
import {user} from "@angular/fire/auth";
import {ImagePost} from "../Model/image-post";
import {Post} from "../Model/Post";

@Component({
  selector: 'app-newfeed',
  templateUrl: './new-feed.component.html',
  styleUrls: ['./new-feed.component.css']
})
export class NewFeedComponent implements OnInit{
    data = localStorage.getItem("user")
    // @ts-ignore
    user:Users = JSON.parse(this.data)
    postsDisplay:PostDisplay[] = [];
    listFriend:Users[] = [];
    listImgPost:ImagePost[][] = [];

  ngOnInit(): void {
    // @ts-ignore
    this.findAll()
    this.findAllFriend()
  }
  constructor(private postService:PostService,
              private userService: UserService) {
  }

  findAllFriend(){
    this.userService.findAllFriend(this.user.id).subscribe((data)=>{
      this.listFriend = data
    })
  }

  findAll(){
    // this.userService.findUserById(1).subscribe((data)=>{
    //   localStorage.setItem("user",JSON.stringify(data))
    //   // @ts-ignore
    //   console.log(data)
      this.postService.findAllPostNewFeed(this.user).subscribe((post)=>{
        this.postsDisplay = post
        this.findAllImgPost(post)
      })
    // })

  }

  findAllImgPost(posts: Post[]){
    this.postService.findAllImgPost(posts).subscribe(img =>{
      this.listImgPost = img
      console.log(this.listImgPost)
    })
}
}
