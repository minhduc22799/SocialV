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
import {NavigationEnd, Router} from "@angular/router";
import * as moment from 'moment';
import {PostComment} from "../Model/post-comment";
import {Notifications} from "../Model/notifications";
import {NotificationService} from "../notificationService/notification.service";
import {Stomp} from "@stomp/stompjs";
import {iif} from "rxjs";

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
  listComment: PostComment[] = [];
  listAllComment: PostComment[][] = [];
  listCommentLike: number[][] = [];
  listCheckLikeComment: boolean[][] = [];
  countLike: any[] = [];
  countComment: any[] = [];
  listPostStatus: PostStatus[] = [];
  listImgCreate: ImagePost[] = [];
  imageFiles: any[] = [];
  imgSrc: string[] = [];
  timeMoment: any[] = []
  timeMomentComment: any[][] = []
  listRequest: Users[] = [];
  listNotification: Notifications[] = [];
  countNotSeen:number = 0
  timeNotificationMoment: any[] = [];
  countOther: any[] = [];
  pathName!: string
  flag!: false;
  postCm?: Post
  commentP?: PostComment
  showMore: boolean = false;
  private stompClient: any;
  listSearchFriend:Users[]=[]

  commentForm: FormGroup = new FormGroup({
    content: new FormControl()
  })

  commentFormEdit: FormGroup = new FormGroup({
    id: new FormControl(),
    content: new FormControl(),
    cmtAt: new FormControl(),
    post: new FormGroup({
      id: new FormControl()
    })
  })

  showMoreItems() {
    this.showMore = true;
  }

  showLessItems() {
    this.showMore = false;
  }

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
    // this.onMoveTop()
    this.findListRequest()
    this.connect()
  }

  onMoveTop() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    })
  }

  constructor(private postService: PostService,
              private userService: UserService,
              private storage: AngularFireStorage,
              private notificationService: NotificationService,
              private router: Router) {

  }

  connect(){
    const socket = new WebSocket('ws://localhost:8080/ws/websocket');
    this.stompClient = Stomp.over(socket);
    const _this = this;
    this.stompClient.connect({}, function (){
      _this.stompClient.subscribe('/topic/greetings', function (notification: any) {
        _this.getAllNotification()
      })
    })
  }

  sendNotification(){
    // @ts-ignore
    this.stompClient.send('/app/hello',{}, this.user.id.toString());
  }
  getAllNotification(){
    this.notificationService.getNotification(this.user.id).subscribe(data =>{
      this.listNotification = data
      for (let j = 0; j < this.checkValidNotification().length; j++){
        this.timeNotificationMoment.push(moment(this.listNotification[j].notificationAt).fromNow())
      }
      this.countNotSeen = 0
      for (let i = 0; i <this.checkValidNotification().length ; i++) {
              // @ts-ignore
              if (!this.checkValidNotification()[i].status){
                this.countNotSeen++
            }

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

  findAllFriend() {
    // @ts-ignore
    this.userService.findAllFriend(this.user.id).subscribe((data) => {
      this.listFriend = data
      this.getAllNotification()
    })
  }

  findAll() {
    this.postService.findAllPostNewFeed(this.user).subscribe((post) => {
      this.postsDisplay = post
      for (let j = 0; j < this.postsDisplay.length; j++) {
        this.timeMoment.push(moment(this.postsDisplay[j].createAt).fromNow())
      }
      this.findAllImgPost(post)
      this.findFriendLike(post)
      this.findCountLike(post)
      this.findCountComment(post)
      this.getAllListComment(post)

    })
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

  deleteRequest(friendRequestId: any) {
    this.userService.deleteRequest(this.user.id, friendRequestId).subscribe(() => {
      this.findListRequest()
    })
  }

  confirmRequest(friendRequestId: any) {
    this.userService.confirmRequest(this.user.id, friendRequestId).subscribe(() => {
      this.findListRequest()
    })
  }

  findCountComment(posts: Post[]) {
    this.postService.findCountCommentPost(posts).subscribe(countComment => {
      this.countComment = countComment
    })
  }

  addComment(post: Post) {

    const postComment = this.commentForm.value
    postComment.users = this.user
    postComment.post = post

    this.postService.addComment(postComment).subscribe(() => {
      this.findAll()
      this.commentForm.reset()
      this.sendNotification();
    })
  }


  getCommentById(id: number) {
    this.postService.getCommentById(id).subscribe((data) => {
      this.commentP = data
      this.commentFormEdit.patchValue(data)
      console.log(data)
    })
  }

  editComment() {
    const postComment = this.commentFormEdit.value
    postComment.users = this.user
    postComment.cmtAt = this.commentP?.cmtAt
    // @ts-ignore
    this.postService.editComment(this.commentP.id, postComment).subscribe(() => {
      this.findAll()
      document.getElementById("edit-comment")?.click()
    })
  }

  deleteComment(id: number) {
    this.postService.deleteComment(id).subscribe(() => {
      this.findAll()
    })
  }


  getAllListComment(posts: Post[]) {
    this.postService.getAllListComment(posts).subscribe(data => {
      this.listAllComment = data
      // console.log(moment(data[2][1].cmtAt).fromNow())
      for (let e = 0; e < data.length; e++) {
        if (data[e].length > 0) {
          this.timeMomentComment[e] = []
          for (let f = 0; f < data[e].length; f++) {
            // @ts-ignore
            this.timeMomentComment[e][f] = moment(data[e][f].cmtAt).fromNow()
          }
        } else {
          this.timeMomentComment[e] = []
        }
      }
      this.getListCommentLike()
      this.getListCheckLikeComment()
    })
  }

  likeComment(id: number) {
    // @ts-ignore
    this.postService.likeComment(this.user.id, id).subscribe(() => {
      this.findAll()
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

  getCommentByIdPost(id: number) {
    this.postService.getListComment(id).subscribe(data => {
      this.listComment = data
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
      this.sendNotification()
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
          Swal.fire({
            position: 'center',
            icon: 'success',
            text: 'Post successfully posted',
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
    }
  }

  findListRequest() {
    // @ts-ignore
    this.userService.findListRequestFriend(this.user.id).subscribe((data) => {
      this.listRequest = data

    })
  }

  likePost(idPost?: number) {
    this.postService.likePost(this.user.id, idPost).subscribe(() => {
      this.findAll()
      this.sendNotification();
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

  logOut() {
    localStorage.removeItem("user");
    this.router.navigate(['']);

  }

  getListCommentLike() {
    this.postService.getCountComment(this.listAllComment).subscribe(data => {
      this.listCommentLike = data
    })
  }

  getListCheckLikeComment() {
    this.postService.getCheckLikeComment(this.listAllComment, this.user.id).subscribe(data => {
      this.listCheckLikeComment = data
    })
  }
  searchUserByNameContaining(name:string){
    this.userService.findUsersByNameContaining(name).subscribe(data=>{
      this.router.navigate(['/SearchFriend']);
      window.localStorage.setItem("listUser", JSON.stringify(data));
      window.localStorage.setItem("nameUser", JSON.stringify(name));
    })
  }
}
