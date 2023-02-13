import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
    listImg:any[] = [];

  ngOnInit(): void {
    // @ts-ignore
    this.findAll()
    this.findAllFriend()
  }
  constructor(private postService:PostService,
              private userService: UserService) {
  }

  findAllFriend(){
    // @ts-ignore
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
      for (let i = 0; i < this.listImgPost.length; i++) {
        // @ts-ignore
        this.listImg[i] = [];
        for (let j = 0; j < this.listImgPost[i].length; j++) {
           // @ts-ignore
         let imageObject1 = {
            image:  this.listImgPost[i][j].img,
            thumbImage:  this.listImgPost[i][j].img,
          };
          this.listImg[i].push(imageObject1);
        }
      }
      console.log(this.listImg)
    })
}





}
