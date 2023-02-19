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
  private stompClient: any;
  // @ts-ignore
  //nick wall
  friend: Users

  // @ts-ignore
  idFiend: number = this.routerActive.snapshot.paramMap.get("id")


  ngOnInit(): void {
    this.findAllPostFriend()
    this.findAllFriend()
    this.findFriend()
    this.findFriendOfFriend()
    this.findMutualFriend()
    this.onMoveTop()
    this.connect()
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

  onMoveTop() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    })
  }


}
