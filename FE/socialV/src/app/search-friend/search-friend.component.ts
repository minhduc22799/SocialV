import {Component, OnInit} from '@angular/core';
import {Users} from "../Model/Users";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {NavigationEnd, Router} from "@angular/router";
import {PostService} from "../PostService/post.service";
import {UserService} from "../service/user.service";
import {Observable} from "rxjs";
import {Stomp} from "@stomp/stompjs";
import * as moment from "moment/moment";
import {Notifications} from "../Model/notifications";
import {NotificationService} from "../notificationService/notification.service";

@Component({
  selector: 'app-search-friend',
  templateUrl: './search-friend.component.html',
  styleUrls: ['./search-friend.component.css']
})
export class SearchFriendComponent implements OnInit{
  data = localStorage.getItem("user")
  // @ts-ignore
  user: Users = JSON.parse(this.data)
  listFriend: Users[] = [];
  listRequest: Users[] = [];
  listNotification: Notifications[] = [];
  countNotSeen:number = 0
  timeNotificationMoment: any[] = [];
  countOther: any[] = [];
  listMutualFriend: number[] = [];
  private stompClient: any;
  // @ts-ignore
  listSearchFriend:Users[]= JSON.parse(localStorage.getItem("listUser"))
  // @ts-ignore
  search:string= JSON.parse(localStorage.getItem("nameUser"))


  ngOnInit(): void {
    // @ts-ignore
    this.findAllFriend()
    // this.onMoveTop()
    this.findListRequest()
    this.connect()
    this.getAllNotification()
    this.findMutualFriend()
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
        _this.findListRequest()
      })
    })
  }

  findMutualFriend() {
    // @ts-ignore
    this.userService.getListCountMutualFriend(this.user.id,this.listSearchFriend).subscribe((data) => {
      this.listMutualFriend = data
    })
  }

  sendNotification(){
    // @ts-ignore
    this.stompClient.send('/app/hello',{}, this.user.id.toString());
  }
  getAllNotification(){
    this.timeNotificationMoment = []
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

  seenNotification(notification: Notifications){
    this.notificationService.seenNotification(notification.id).subscribe(()=>{
      this.getAllNotification()
    });
  }

  findAllFriend() {
    // @ts-ignore
    this.userService.findAllFriend(this.user.id).subscribe((data) => {
      this.listFriend = data
    })
  }


  confirmRequest(friendRequestId: any) {
    this.userService.confirmRequest(this.user.id, friendRequestId).subscribe(() => {
      this.findListRequest()
      this.sendNotification()
    })
  }

  findListRequest() {
    // @ts-ignore
    this.userService.findListRequestFriend(this.user.id).subscribe((data) => {
      this.listRequest = data

    })
  }


  logOut() {
    localStorage.removeItem("user");
    this.router.navigate(['']);

  }

  deleteRequest(friendRequestId: any) {
    this.userService.deleteRequest(this.user.id, friendRequestId).subscribe(() => {
      this.findListRequest()
      this.sendNotification()
    })
  }

  searchUserByNameContaining(name:string){
    this.userService.findUsersByNameContaining(name).subscribe(data=>{

        this.listSearchFriend=data
    })
  }


}
