import {Component, OnInit} from '@angular/core';
import {Users} from "../Model/Users";
import {UserService} from "../service/user.service";
import {PostService} from "../PostService/post.service";
import {PostDisplay} from "../Model/Post-display";
import {Post} from "../Model/Post";
import {ImagePost} from "../Model/image-post";
import {ActivatedRoute, NavigationEnd} from "@angular/router";
// @ts-ignore
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {FormControl, FormGroup} from "@angular/forms";
import {PostStatus} from "../Model/post-status";
import {AngularFireStorage, AngularFireStorageReference} from "@angular/fire/compat/storage";
import {Router} from "@angular/router";
import * as moment from "moment/moment";
import {NotificationService} from "../notificationService/notification.service";
import {Notifications} from "../Model/notifications";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  data = localStorage.getItem("user")
  // @ts-ignore
  user:Users = JSON.parse(this.data)
  arrFileInFireBase: AngularFireStorageReference | undefined
  listFriend:Users[] = [];
  listPostProfile:PostDisplay[] = []
  listFriendPost:Users[][] = [];
  listImgPost:ImagePost[][] = [];
  listPostStatus: PostStatus[] = [];
  listImg:any[] = [];
  listImgCreate: ImagePost[] = [];
  listNotification: Notifications[] = [];
  checkUploadMultiple = false;
  timeMoment: any[] = [];
  countLike:any[] = [];
  imageFiles: any[] = [];
  imgSrc: string[] = [];
  listImgDelete: number[] = [];
  listImgUpdate: ImagePost[] = [];
  countComment:any[] = [];
  timeNotificationMoment: any[] = [];
  countOther: any[] = [];
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
    this.onMoveTop()

  }
  onMoveTop(){
    this.router.events.subscribe((event)=>{
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    })
  }

  constructor( private userService: UserService,
               private postService: PostService,
               private notificationService: NotificationService,
               private routerActive:ActivatedRoute,
               private storage: AngularFireStorage,
               private router:Router) {
  }
  // @ts-ignore
  findAllFriend(): Users[]{
    // @ts-ignore
    this.userService.findAllFriend(this.user.id).subscribe((data)=>{
      this.listFriend = data
      this.getAllNotification()
    })
  }

  getAllNotification(){
    this.notificationService.getNotification(this.user.id).subscribe(data =>{
      this.listNotification = data
      for (let j = 0; j < this.checkValidNotification().length; j++){
        this.timeNotificationMoment.push(moment(this.listNotification[j].notificationAt).fromNow())
      }
      this.countOtherNotification(this.listNotification);
    })
  }

  countOtherNotification(notification: Notifications[]){
    this.notificationService.countOther(notification).subscribe(data =>{
      this.countOther = data
    })
  }

  checkValidNotification(){
    for (let t = 0; t < this.listNotification.length; t++){
      if (this.listNotification[t]?.users?.id == this.user.id){
        this.listNotification.splice(t,1)
        t--;
      }
      if (this.listNotification[t]?.notificationType?.id == 1 ){
      let flag = true;
        for (let k = 0; k < this.listFriend.length; k++){
          if (this.listNotification[t].users?.id == this.listFriend[k].id){
            flag = false;
          }
        }
        if (flag){
          this.listNotification.splice(t,1)
          t--;
        }
      }
    }
    return this.listNotification;
}

  seenNotification(id: number | undefined){
    this.notificationService.seenNotification(id).subscribe();
  }

  findPostAllProfile(){
    // @ts-ignore
    this.postService.findAllPostProfile(this.user.id).subscribe(data =>{
      this.listPostProfile = data
      for (let j = 0; j < this.listPostProfile.length; j++){
        this.timeMoment.push(moment(this.listPostProfile[j].createAt).fromNow())
      }
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

    })
  }

  deletePost(id: any){

      Swal.fire({
        title: 'Are you sure?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result:any) => {
        if (result.isConfirmed) {
          this.postService.deletePost(id).subscribe(()=>{
            this.findPostAllProfile()
          })
        }
    })
  }

  searchOnWall(content:string){
    this.userService.searchPostOnWall(this.user.id,content).subscribe((data)=>{
      this.listPostProfile=data
    })

  }

  getPost(id: any){
    this.postService.getPost(id).subscribe(data =>{
    this.postUpdateForm.patchValue(data)
      this.getImg(data.id)
    })
  }

  getImg(id: any){
    this.postService.getImg(id).subscribe( data =>{
      this.listImgUpdate = data;
    })
  }

  editPost(){
    const post = this.postUpdateForm.value
    post.users = this.user
    this.postService.editPost(post).subscribe(()=>{
      this.postService.editImgPost(this.listImgDelete).subscribe(()=>{
        if (this.imageFiles.length == 0){
          document.getElementById("btn-close-edit")?.click()
          Swal.fire(
            'Good job!',
            'You clicked the button!',
            'success'
          )
          this.findPostAllProfile()
        }
        this.createPostImg(post)

      this.findPostAllProfile()
      })

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

  editListImgDelete(id: any, index: any){
    this.listImgUpdate.splice(index,1)
    this.listImgDelete.push(id);
    console.log(this.listImgDelete)
  }

  clearImgSrc(){
    this.imgSrc = []
    this.listImgDelete = []
    this.imageFiles = []
  }

  t = 0;

  createPostImg(post: Post) {
    if (this.imageFiles !== undefined) {
      this.checkUploadMultiple = true
      this.arrFileInFireBase = this.storage.ref(this.imageFiles[this.t].name);
      this.arrFileInFireBase.put(this.imageFiles[this.t]).then(data => {
        return data.ref.getDownloadURL();
      }).then(url => {
        this.checkUploadMultiple = false
        let imagePost: ImagePost = {
          post: post,
          img: url
        }
        this.listImgCreate.push(imagePost)
      }).then(() => {
        this.t++
        if (this.t < this.imageFiles.length) {
          this.createPostImg(post)
        } else {
          this.t = 0
          this.postService.createPostImg(this.listImgCreate).subscribe(() => {
            this.findPostAllProfile()
          })
          document.getElementById("btn-close-edit")?.click()
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

  logOut(){
    localStorage.removeItem("user");
    this.router.navigate(['']);

  }
}
