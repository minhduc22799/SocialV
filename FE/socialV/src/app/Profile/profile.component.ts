import {Component, OnInit} from '@angular/core';
import {Users} from "../Model/Users";
import {UserService} from "../service/user.service";
import {PostService} from "../PostService/post.service";
import {user} from "@angular/fire/auth";
import {PostDisplay} from "../Model/Post-display";
import {Post} from "../Model/Post";
import {ImagePost} from "../Model/image-post";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  data = localStorage.getItem("user")
  // @ts-ignore
  user:Users = JSON.parse(this.data)
  listFriend:Users[] = [];
  listPostProfile:PostDisplay[] = []
  listFriendPost:Users[][] = [];
  listImgPost:ImagePost[][] = [];
  listImg:any[] = [];
  countLike:any[] = [];
  countComment:any[] = [];
  posts:Post[]=[]

  ngOnInit(): void {
    this.findAllFriend()
    this.findPostAllProfile()
  }

  constructor( private userService: UserService ,
               private postService: PostService ,
               private routerActive:ActivatedRoute) {
  }
  findAllFriend(){
    // @ts-ignore
    this.userService.findAllFriend(this.user.id).subscribe((data)=>{
      this.listFriend = data
    })
  }

  findPostAllProfile(){
    // @ts-ignore
    this.postService.findAllPostProfile(this.user.id).subscribe(data =>{
      this.listPostProfile = data
      this.findAllImgPost(data)
      this.findFriendLike(data)
      this.findCountLike(data)
      this.findCountComment(data)
    })
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

  searchOnWall(id:number,content:string){
     id = Number(this.routerActive.snapshot.paramMap.get("id"))
    this.userService.searchPostOnWall(id, content).subscribe((data)=>{
      this.posts=data
    })

  }
}
