import {Component, OnInit} from '@angular/core';
import {Users} from "../Model/Users";
import {UserService} from "../service/user.service";
import {PostService} from "../PostService/post.service";
import {user} from "@angular/fire/auth";
import {PostDisplay} from "../Model/Post-display";
import {Post} from "../Model/Post";
import {ImagePost} from "../Model/image-post";
import {FormControl, FormGroup} from "@angular/forms";
import {PostStatus} from "../Model/post-status";
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
  listPostStatus: PostStatus[] = [];
  listImg:any[] = [];
  checkUploadMultiple = false;
  countLike:any[] = [];
  imageFiles: any[] = [];
  imgSrc: string[] = [];
  countComment:any[] = [];
  post!: Post
  postUpdateForm: FormGroup = new FormGroup({
    id: new FormControl(),
    users: new FormGroup({
      id: new FormControl()
    }),
    content: new FormControl(),
    createAt: new FormControl(),
    postStatus: new FormGroup({
      id: new FormControl()
    })
  })
  ngOnInit(): void {
    this.findAllFriend()
    this.findPostAllProfile()
    this.getAllPostStatus()
  }

  constructor( private userService: UserService ,
               private postService: PostService ) {
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

  deletePost(id: any){
    this.postService.deletePost(id).subscribe(()=>{
      this.findPostAllProfile()
    })
  }

  getPost(id: any){
    this.postService.getPost(id).subscribe(data =>{
    this.postUpdateForm.patchValue(data)
    })
  }

  editPost(){
    const post = this.postUpdateForm.value
    post.users = this.user
    this.postService.editPost(post).subscribe(()=>{
      document.getElementById("btn-close-edit")?.click()
      this.findPostAllProfile()
    })
  }

  submitAvatar(event: any) {
    this.imgSrc = []
    this.imageFiles = event.target.files;
    for (let i = 0; i < this.imageFiles.length; i++) {
      console.log(this.imageFiles[i])
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgSrc.push(e.target.result);
      };
      reader.readAsDataURL(this.imageFiles[i]);
    }
  }

  getAllPostStatus() {
    this.postService.getAllPostStatus().subscribe(data => {
      this.listPostStatus = data;
    })
  }
}
