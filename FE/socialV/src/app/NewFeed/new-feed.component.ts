import {Component, OnInit} from '@angular/core';
import {PostDisplay} from "../Model/Post-display";
import {PostService} from "../PostService/post.service";
import {UserService} from "../service/user.service";
import {Users} from "../Model/Users";
import {ImagePost} from "../Model/image-post";
import {Post} from "../Model/Post";
import {FormControl, FormGroup} from "@angular/forms";
import {PostStatus} from "../Model/post-status";
// @ts-ignore
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {finalize} from "rxjs";

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
  listFriendPost: Users[][] = [];
  listImg: any[] = [];
  listImgCreate: ImagePost[] = [];
  countLike: any[] = [];
  countComment: any[] = [];
  listPostStatus: PostStatus[] = [];
  imageFiles: any[] = [];
  imgSrc: string[] = [];
  pathName!: string
  flag!: false;
  postForm: FormGroup = new FormGroup({
    content: new FormControl(),
    postStatus: new FormGroup({
      id: new FormControl("1")
    })
  })

  ngOnInit(): void {
    // @ts-ignore
    this.findAll()
    this.findAllFriend()
    this.getAllPostStatus()
  }

  constructor(private postService: PostService,
              private userService: UserService,
              private storage: AngularFireStorage) {
  }

  findAllFriend() {
    // @ts-ignore
    this.userService.findAllFriend(this.user.id).subscribe((data) => {
      this.listFriend = data
    })
  }

  findAll() {
    this.postService.findAllPostNewFeed(this.user).subscribe((post) => {
      this.postsDisplay = post
      this.findAllImgPost(post)
      this.findFriendLike(post)
      this.findCountLike(post)
      this.findCountComment(post)
    })
    // })

  }

  findFriendLike(posts: Post[]) {
    this.postService.findLikePost(posts).subscribe(like => {
      this.listFriendPost = like
    })
  }

  findCountLike(posts: Post[]) {
    this.postService.findCountLikePost(posts).subscribe(countLike => {
      this.countLike = countLike
    })
  }

  findCountComment(posts: Post[]) {
    this.postService.findCountCommentPost(posts).subscribe(countComment => {
      this.countComment = countComment
    })
  }


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

  getAllPostStatus() {
    this.postService.getAllPostStatus().subscribe(data => {
      this.listPostStatus = data;
    })
  }

  createPost() {
    const post = this.postForm.value
    post.users = this.user
    this.postService.createPost(post).subscribe( data => {
      this.createPostImg(data)
      this.findAll()
      document.getElementById("btn-close")?.click()
      Swal.fire(
        'Good job!',
        'You clicked the button!',
        'success'
      )
    })
  }

  submitAvatar(event: any) {
    this.imageFiles = event.target.files;
    for (let i = 0; i < this.imageFiles.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgSrc.push(e.target.result);
      };
      reader.readAsDataURL(this.imageFiles[i]);
    }
  }

  createPostImg(post: Post) {
    if (this.imageFiles !== undefined) {
      for (let i = 0; i < this.imageFiles.length; i++) {
        const imagePath = `image/${this.imageFiles[i].name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
        const fileRef = this.storage.ref(imagePath);
        this.storage.upload(imagePath, this.imageFiles[i]).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              let imagePost: ImagePost = {
                post: post,
                img: url
              }
              this.postService.createPostImg(imagePost).subscribe();
            });
          })
        ).subscribe()
      }
    }
  }

}
