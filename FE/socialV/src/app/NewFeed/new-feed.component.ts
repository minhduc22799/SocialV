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
import {AngularFireStorage, AngularFireStorageReference} from "@angular/fire/compat/storage";
import {Router} from "@angular/router";
import * as moment from 'moment';
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
  countLike: any[] = [];
  countComment: any[] = [];
  listPostStatus: PostStatus[] = [];
  listImgCreate: ImagePost[] = [];
  imageFiles: any[] = [];
  imgSrc: string[] = [];
  timeMoment: any[] = []
  pathName!: string
  flag!: false;
  postForm: FormGroup = new FormGroup({
    content: new FormControl(),
    postStatus: new FormGroup({
      id: new FormControl("1")
    })
  })
  // upload file c2
  arrFileInFireBase: AngularFireStorageReference | undefined
  checkUploadMultiple = false;

  ngOnInit(): void {
    // @ts-ignore
    this.findAll()
    this.findAllFriend()
    this.getAllPostStatus()
  }

  constructor(private postService: PostService,
              private userService: UserService,
              private storage: AngularFireStorage,
              private router:Router) {
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
      for (let j = 0; j < this.postsDisplay.length; j++){
        this.timeMoment.push(moment(this.postsDisplay[j].createAt).fromNow())
      }
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
    this.postService.createPost(post).subscribe(data => {
      // @ts-ignore
      if (this.imageFiles.length === 0) {
        this.postForm.reset();
        this.findAll();
        document.getElementById("btn-close")?.click()
        Swal.fire(
          'Good job!',
          'You clicked the button!',
          'success'
        )
      } else {
        this.createPostImg(data)
      }
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

  i = 0;

  createPostImg(post: Post) {
    if (this.imageFiles !== undefined) {
      this.checkUploadMultiple = true
      this.arrFileInFireBase = this.storage.ref(this.imageFiles[this.i].name);
      this.arrFileInFireBase.put(this.imageFiles[this.i]).then(data => {
        return data.ref.getDownloadURL();
      }).then(url => {
        this.checkUploadMultiple = false
        let imagePost: ImagePost = {
          post: post,
          img: url
        }
        this.listImgCreate.push(imagePost)
      }).then(() => {
        this.i++
        if (this.i < this.imageFiles.length) {
          this.createPostImg(post)
        } else {
          this.i = 0
          this.postService.createPostImg(this.listImgCreate).subscribe(() => {
            this.findAll()
          })
          document.getElementById("btn-close")?.click()
          this.postForm.reset();
          this.imgSrc = []
          Swal.fire(
            'Good job!',
            'You clicked the button!',
            'success'
          )
        }
      })
    }
  }

  deleteImgCreate(id: any | undefined) {
    this.imgSrc.splice(id, 1);
    let a: any[] = []
    for (let i = 0; i < this.imageFiles.length; i++) {
      if (i != id) {
        a.push(this.imageFiles[i])
      }
    }
    this.imageFiles = a
  }

  logOut(){
    localStorage.removeItem("user");
    this.router.navigate(['']);

  }

}
