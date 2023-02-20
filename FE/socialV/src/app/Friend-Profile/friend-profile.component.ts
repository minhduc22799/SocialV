import {Component, OnInit} from '@angular/core';
import {PostService} from "../PostService/post.service";
import {Users} from "../Model/Users";
import {PostDisplay} from "../Model/Post-display";
import {ImagePost} from "../Model/image-post";
import {UserService} from "../service/user.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Post} from "../Model/Post";
import * as moment from "moment/moment";
import {FriendRequest} from "../Model/friend-request";
import {Notifications} from "../Model/notifications";
import {NotificationService} from "../notificationService/notification.service";
import {Stomp} from "@stomp/stompjs";
import {FormControl, FormGroup} from "@angular/forms";
import {PostComment} from "../Model/post-comment";

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.component.html',
  styleUrls: ['./friend-profile.component.css']
})
export class FriendProfileComponent implements OnInit {
  data = localStorage.getItem("user")
  // @ts-ignore
  user: Users = JSON.parse(this.data)
  postsDisplayFriend: PostDisplay[] = [];
  listFriend: Users[] = [];
  existF?:boolean;
  timeMoment: any[] = [];
  listMutualFriend: Users[] = [];
  listFriendOfFriend: Users[] = [];
  listImgPost: ImagePost[][] = [];
  listFriendPost: Users[][] = [];
  listImg: any[] = [];
  countLike: any[] = [];
  checkRequestFr?:boolean;
  checkRequestFr2?:boolean;
  countComment: any[] = [];
  listRequest:Users[] = [];
  listNotification: Notifications[] = [];
  timeNotificationMoment: any[] = [];
  countOther: any[] = [];
  countNotSeen:number = 0
  private stompClient: any;
  numToShow = 3;

  // @ts-ignore
  //nick wall
  friend: Users

  // @ts-ignore
  idFiend: number = this.routerActive.snapshot.paramMap.get("id")
  commentP?:PostComment
  listComment: PostComment[] = [];
  listAllComment: PostComment[][] = [];
  listCommentLike: number[][] = [];
  listCheckLikeComment: boolean[][] = [];
  timeMomentComment: any[][] = []
  commentForm:FormGroup = new FormGroup({
    content: new FormControl()
  })

  commentFormEdit:FormGroup = new FormGroup({
    id:new FormControl(),
    content: new FormControl(),
    cmtAt: new FormControl(),
    post: new FormGroup({
      id:new FormControl()
    })
  })

  ngOnInit(): void {
    this.findAllPostFriend()
    this.findAllFriend()
    this.findFriend()
    this.findFriendOfFriend()
    this.findMutualFriend()
    this.connect()


  }
  showMore() {
    this.numToShow += 5;
  }

  showLess() {
    this.numToShow -= 5;
  }

  constructor(private postService: PostService,
              private userService: UserService,
              private routerActive: ActivatedRoute,
              private notificationService: NotificationService,
              private router: Router
  ) {
  }

  findAllPostFriend() {

    // @ts-ignore
    this.postService.findAllPostWallFriend(this.idFiend, this.user.id).subscribe(data => {
      this.postsDisplayFriend = data
      for (let j = 0; j < this.postsDisplayFriend.length; j++) {
        this.timeMoment.push(moment(this.postsDisplayFriend[j].createAt).fromNow())
      }
      this.findAllImgPost(data)
      this.findFriendLike(data)
      this.findCountLike(data)
      this.findCountComment(data)
      this.getAllListComment(data)

    })
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

  checkExist(user: Users) {
    for (let i = 0; i < this.listMutualFriend.length; i++) {
      if (user.id === this.listMutualFriend[i].id) {
        return 1
      }
      if (user.id === this.user.id) {
        return 0
      }

    }
    return -1;
  }

  checkFriendExist(user: Users): boolean{
    for (let i = 0; i < this.listFriend.length; i++) {
      if (user.id === this.listFriend[i].id){
        return true;
      }
    }
    return false;
  }

  checkExistFriend() {
    this.existF = false
    for (let i = 0; i < this.listFriendOfFriend.length; i++) {
      if (this.user.id === this.listFriendOfFriend[i].id) {
        this.existF = true
      }
    }
  }

  findFriend() {
    this.userService.findUserById(this.idFiend).subscribe(data => {
      this.friend = data
      this.checkRequest()
      this.checkRequest2()
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
    })
  }

  requestFriend(user: Users) {

    // @ts-ignore
    const friendRequest: FriendRequest = {
      usersReceive: user,
      usersRequest: this.user,
      status: false
    }
      // @ts-ignore
      this.userService.requestFriend(friendRequest).subscribe(() => {
        this.checkExistFriend()
        this.checkRequest()
      },() =>{
        location.reload()
      })

  }
  checkRequest(){
      // @ts-ignore
    this.userService.checkRequest(this.user.id,this.friend.id).subscribe(data =>{
      this.checkRequestFr = data
    })
}

  checkRequest2(){
    // @ts-ignore
    this.userService.checkRequest(this.friend.id,this.user.id).subscribe(data =>{
      this.checkRequestFr2 = data
    })
  }

  findListRequest(){
    // @ts-ignore
    this.userService.findListRequestFriend(this.user.id).subscribe((data)=>{
      this.listRequest = data

    })
  }

  deleteRequest(){
    this.userService.deleteRequest(this.user.id, this.friend.id).subscribe(()=>{
      this.findFriendOfFriend()
      this.checkExistFriend();
      this.checkRequest();
      this.checkRequest2();
    })
  }
  confirmRequest(){
    this.userService.confirmRequest(this.user.id, this.friend.id).subscribe(()=>{
      this.findFriendOfFriend()
      this.checkExistFriend();
      this.checkRequest();
      this.checkRequest2();
    })
  }

  findAllFriend() {
    // @ts-ignore
    this.userService.findAllFriend(this.user.id).subscribe((data) => {
      this.listFriend = data
      this.getAllNotification()
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


  findMutualFriend() {
    // @ts-ignore
    this.userService.findMutualFriends(this.idFiend, this.user.id).subscribe((data) => {
      this.listMutualFriend = data
    })
  }

  findFriendOfFriend() {
    this.userService.findFriendOfFriend(this.idFiend).subscribe(data => {
      this.listFriendOfFriend = data
      this.checkExistFriend()

    })
  }

  routerProfile(id?: number) {
    this.router.navigate(['/friendProfile/' + id])
    window.onload
  }

  logOut() {
    localStorage.removeItem("user");
    this.router.navigate(['']);

  }

  likePost(idPost?: number) {
    this.postService.likePost(this.user.id, idPost).subscribe(() => {
      this.findAllPostFriend()
    })
  }

  addComment(post:Post){

    const postComment = this.commentForm.value
    postComment.users = this.user
    postComment.post = post

    this.postService.addComment(postComment).subscribe(() =>{
      this.findAllPostFriend()
      this.commentForm.reset()
    })
  }


  getCommentById(id:number){
    this.postService.getCommentById(id).subscribe((data)=>{
      this.commentP = data
      this.commentFormEdit.patchValue(data)
      console.log(data)
    })
  }
  editComment(){
    const postComment = this.commentFormEdit.value
    postComment.users = this.user
    postComment.cmtAt = this.commentP?.cmtAt
    // @ts-ignore
    this.postService.editComment(this.commentP.id,postComment).subscribe(() =>{
      this.findAllPostFriend()
      document.getElementById("edit-comment")?.click()
    })
  }

  deleteComment(id:number){
    this.postService.deleteComment(id).subscribe(()=>{
      this.findAllPostFriend()
    })
  }


  getAllListComment(posts: Post[]) {
    this.postService.getAllListComment(posts).subscribe(data => {
      this.listAllComment = data
      // console.log(moment(data[2][1].cmtAt).fromNow())
      for (let e = 0; e < data.length; e++){
        if (data[e].length > 0) {
          this.timeMomentComment[e] = []
          for (let f = 0; f < data[e].length; f++) {
            // @ts-ignore
            this.timeMomentComment[e][f] = moment(data[e][f].cmtAt).fromNow()
          }
        }else {
          this.timeMomentComment[e] = []
        }
      }
      this.getListCommentLike()
      this.getListCheckLikeComment()
    })
  }

  likeComment(id:number){
    // @ts-ignore
    this.postService.likeComment(this.user.id, id).subscribe(()=>{
      this.findAllPostFriend()
    })
  }
  getCommentByIdPost(id: number) {
    this.postService.getListComment(id).subscribe(data => {
      this.listComment = data
    })
  }

  getListCommentLike(){
    this.postService.getCountComment(this.listAllComment).subscribe(data=>{
      this.listCommentLike = data
    })
  }

  getListCheckLikeComment(){
    this.postService.getCheckLikeComment(this.listAllComment, this.user.id).subscribe(data=>{
      this.listCheckLikeComment = data
    })
  }



}
