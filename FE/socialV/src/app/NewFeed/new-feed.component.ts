import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PostDisplay} from "../Model/Post-display";
import {PostService} from "../PostService/post.service";
import {UserService} from "../service/user.service";
import {Users} from "../Model/Users";
import {ImagePost} from "../Model/image-post";
import {Post} from "../Model/Post";
import {FormControl, FormGroup} from "@angular/forms";
import {PostStatus} from "../Model/post-status";

@Component({
  selector: 'app-newfeed',
  templateUrl: './new-feed.component.html',
  styleUrls: ['./new-feed.component.css']
})
export class NewFeedComponent implements OnInit {
  data = localStorage.getItem("user")
  // @ts-ignore
  user: Users = JSON.parse(this.data)
  postsDisplay: PostDisplay[] = [];
  listFriend: Users[] = [];
  listImgPost: ImagePost[][] = [];
  listImg: any[] = [];
  listPostStatus: PostStatus[] = [];
  postForm: FormGroup = new FormGroup({
    users: new FormGroup({
      id: new FormControl()
    }),
    content: new FormControl(),
    createAt: new FormControl(),
    postStatus: new FormGroup({
      id: new FormControl()
    })
  })
export class NewFeedComponent implements OnInit{
    data = localStorage.getItem("user")
    // @ts-ignore
    user:Users = JSON.parse(this.data)
    postsDisplay:PostDisplay[] = [];
    listFriend:Users[] = [];
    listImgPost:ImagePost[][] = [];
    listFriendPost:Users[][] = [];
    listImg:any[] = [];
    countLike:any[] = [];
    countComment:any[] = [];

  ngOnInit(): void {
    // @ts-ignore
    this.findAll()
    this.findAllFriend()
  }

  constructor(private postService: PostService,
              private userService: UserService) {
  }

  findAllFriend() {
    // @ts-ignore
    this.userService.findAllFriend(this.user.id).subscribe((data) => {
      this.listFriend = data
    })
  }

  findAll(){
      this.postService.findAllPostNewFeed(this.user).subscribe((post)=>{
        this.postsDisplay = post
        this.findAllImgPost(post)
        this.findFriendLike(post)
        this.findCountLike(post)
        this.findCountComment(post)
      })
    // })

  }

  findFriendLike(posts: Post[]){
    this.postService.findLikePost(posts).subscribe( like =>{
      this.listFriendPost = like
    })
  }
  findCountLike(posts: Post[]){
    this.postService.findCountLikePost(posts).subscribe(countLike =>{
      this.countLike = countLike
    })
  }

  findCountComment(posts: Post[]){
    this.postService.findCountCommentPost(posts).subscribe(countComment =>{
      this.countComment = countComment
    })
  }


  findAllImgPost(posts: Post[]){
    this.postService.findAllImgPost(posts).subscribe(img =>{
  findAllImgPost(posts: Post[]) {
    this.postService.findAllImgPost(posts).subscribe(img => {
      this.listImgPost = img
      for (let i = 0; i < this.listImgPost.length; i++) {
        // @ts-ignore
        this.listImg[i] = [];
        for (let j = 0; j < this.listImgPost[i].length; j++) {
          // @ts-ignore
          let imageObject1 = {
            image: this.listImgPost[i][j].img,
            thumbImage: this.listImgPost[i][j].img,
          };
          this.listImg[i].push(imageObject1);
        }
      }
      console.log(this.listImg)
    })
  }

  createPost() {

  }


}
