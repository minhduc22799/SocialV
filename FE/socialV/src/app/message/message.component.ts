import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {Users} from "../Model/Users";
import {Notifications} from "../Model/notifications";
import {PostService} from "../PostService/post.service";
import {UserService} from "../service/user.service";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {NotificationService} from "../notificationService/notification.service";
import {Router, NavigationEnd} from "@angular/router";
import {Stomp} from "@stomp/stompjs";
import * as moment from "moment";
import {ChatService} from "../chatService/chat.service";
import {Conversation} from "../Model/conversation";
import {Messages} from "../Model/message";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewChecked {
  data = localStorage.getItem("user")
  // @ts-ignore
  user: Users = JSON.parse(this.data)
  listFriend: Users[] = [];
  listRequest: Users[] = [];
  listPersonalConversation: Conversation[] = [];
  listGroupConversation: Conversation[] = [];
  listUserConversation: Users[][] = [];
  listUserGroup: Users[][] = [];
  listNameGroup: string[] = [];
  listStringUserConversation: string[] = [];
  listStringUserImgConversation: string[] = [];
  userNameChat?: string;
  userImgChat?: string;
  listMessage: Messages[] = [];
  listNotification: Notifications[] = [];
  countNotSeen: number = 0
  timeNotificationMoment: any[] = [];
  countOther: any[] = [];
  listMutualFriend: number[] = [];
  private stompClient: any;
  conversationNow!: Conversation
  messageForm: FormGroup = new FormGroup({
    content: new FormControl()
  })
  // @ts-ignore
  search: string = JSON.parse(localStorage.getItem("nameUser"))

  ngOnInit(): void {
    this.findAllFriend()
    this.findListRequest()
    this.connect()
    this.getAllNotification()
    this.getAllPersonalConversation()
    this.getAllGroupConversation()
    this.fromFriendProfile()
  }

  constructor(private postService: PostService,
              private userService: UserService,
              private storage: AngularFireStorage,
              private notificationService: NotificationService,
              private chatService: ChatService,
              private router: Router) {
  }

  ngAfterViewChecked(): void {
    if (this.conversationNow != null) {
      document.getElementById("showChat")!.click()
    }
  }

  sendMessage(conversation: Conversation) {
    const message: Messages = this.messageForm.value
    message.users = this.user
    message.conversation = conversation
    this.chatService.sendMessage(message).subscribe(() => {
      this.getAllPersonalConversation()
      this.getAllGroupConversation()
      this.chatService.getMessage(conversation.id).subscribe(data => {
        this.listMessage = data
        this.messageForm.reset()
        this.sendNotification()
      })
    })
  }

  fromFriendProfile() {

    // @ts-ignore
    this.conversationNow = JSON.parse(localStorage.getItem("roomChat"))
    if (this.conversationNow !== null) {
      this.chatService.getMessage(this.conversationNow?.id).subscribe(data => {
        this.listMessage = data
        this.chatService.findMember(this.conversationNow?.id).subscribe(data => {
          console.log(this.conversationNow)
          for (let i = 0; i < data.length; i++) {
            if (data[i].id !== this.user.id) {
              this.userNameChat = data[i].name
              this.userImgChat = data[i].avatar
              break;
            }
          }
          localStorage.removeItem("roomChat");
        })
      })
    }
  }

  changeNameGroup(conversation: Conversation, name: string){
    conversation.name = name
    this.chatService.changeNameGroup(conversation).subscribe(()=>{
      document.getElementById("change-name")!.click()
      this.getAllGroupConversation()
      this.userNameChat = name
    })
  }


  getAllPersonalConversation() {
    this.chatService.getAllPersonalConversation(this.user).subscribe(data => {
      this.listPersonalConversation = data
      this.chatService.findAllMemberInConversation(this.listPersonalConversation).subscribe(data => {
        this.listUserConversation = data
        for (let i = 0; i < this.listUserConversation.length; i++) {
          for (let j = 0; j < this.listUserConversation[i].length; j++) {
            if (this.listUserConversation[i][j].id !== this.user.id) {
              // @ts-ignore
              this.listStringUserConversation[i] = this.listUserConversation[i][j].name
              // @ts-ignore
              this.listStringUserImgConversation[i] = this.listUserConversation[i][j].avatar
            }
          }
        }
      })
    })
  }

  getAllGroupConversation() {
    this.chatService.getAllGroupConversation(this.user).subscribe(data => {
      this.listGroupConversation = data
      this.chatService.findAllMemberInConversation(this.listGroupConversation).subscribe(data => {
        this.listUserGroup = data;
        this.listNameGroup = []
        for (let i = 0; i < this.listGroupConversation.length; i++) {
          if (this.listGroupConversation[i].name != null) {
            // @ts-ignore
            this.listNameGroup[i] = this.listGroupConversation[i].name
          } else {
            this.listNameGroup[i] = "";
            for (let j = 0; j < this.listUserGroup[i].length; j++) {
              this.listNameGroup[i] += this.listUserGroup[i][j].name
              if (j < this.listUserGroup[i].length - 1) {
                this.listNameGroup[i] += `, `;
              }
            }
          }
        }
      })
    })
  }

  transferChatDetail(id: number, conversation: Conversation, typeId: number) {
    this.chatService.getMessage(conversation?.id).subscribe(data => {
      this.conversationNow = conversation
      this.listMessage = data
      if (typeId == 1) {
        this.userNameChat = this.listStringUserConversation[id]
        this.userImgChat = this.listStringUserImgConversation[id]
      }
      if (typeId == 2) {
        this.userNameChat = this.listNameGroup[id]
        this.userImgChat = "https://phunugioi.com/wp-content/uploads/2021/11/Hinh-anh-nhom-ban-than-tao-dang-vui-ve-ben-bo-bien-395x600.jpg"
      }
    })
  }

  connect() {
    const socket = new WebSocket('ws://localhost:8080/ws/websocket');
    this.stompClient = Stomp.over(socket);
    const _this = this;
    this.stompClient.connect({}, function () {
      _this.stompClient.subscribe('/topic/greetings', function (notification: any) {
        _this.getAllNotification()
        _this.findListRequest()
        _this.findAllFriend()
        _this.getAllPersonalConversation()
        _this.chatService.getMessage(_this.conversationNow.id).subscribe(data => {
          _this.listMessage = data
          _this.messageForm.reset()
        })
      })
    })
  }


  sendNotification() {
    // @ts-ignore
    this.stompClient.send('/app/hello', {}, this.user.id.toString());
  }

  getAllNotification() {
    this.timeNotificationMoment = []
    this.notificationService.getNotification(this.user.id).subscribe(data => {
      this.listNotification = data
      for (let j = 0; j < this.checkValidNotification().length; j++) {
        this.timeNotificationMoment.push(moment(this.listNotification[j].notificationAt).fromNow())
      }
      this.countNotSeen = 0
      for (let i = 0; i < this.checkValidNotification().length; i++) {
        // @ts-ignore
        if (!this.checkValidNotification()[i].status) {
          this.countNotSeen++
        }

      }
      this.countOtherNotification(this.listNotification);
    })
  }

  countOtherNotification(notification: Notifications[]) {
    this.notificationService.countOther(notification).subscribe(data => {
      this.countOther = data
    })
  }

  checkValidNotification() {
    for (let t = 0; t < this.listNotification.length; t++) {
      if (this.listNotification[t]?.users?.id == this.user.id) {
        this.listNotification.splice(t, 1)
        t--;
      }
      if (this.listNotification[t]?.notificationType?.id == 1) {
        let flag = true;
        for (let k = 0; k < this.listFriend.length; k++) {
          if (this.listNotification[t].users?.id == this.listFriend[k].id) {
            flag = false;
          }
        }
        if (flag) {
          this.listNotification.splice(t, 1)
          t--;
        }
      }
    }
    return this.listNotification;
  }

  seenNotification(notification: Notifications) {
    this.notificationService.seenNotification(notification.id).subscribe(() => {
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
    this.userService.logOut(this.user).subscribe(() => {
      localStorage.removeItem("user");
      this.sendNotification()
      this.router.navigate(['']);
    })
  }

  deleteRequest(friendRequestId: any) {
    this.userService.deleteRequest(this.user.id, friendRequestId).subscribe(() => {
      this.findListRequest()
      this.sendNotification()
    })
  }
}
