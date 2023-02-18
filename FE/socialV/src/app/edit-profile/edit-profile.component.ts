import {Component, OnInit} from '@angular/core';
import {UserService} from "../service/user.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
// @ts-ignore
import {Users} from "../model/Users";
import {UserUpdate} from "../model/UserUpdate";
import {NavigationEnd, Router} from "@angular/router";
// @ts-ignore
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {finalize} from "rxjs";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {Notifications} from "../Model/notifications";
import {NotificationService} from "../notificationService/notification.service";
import * as moment from "moment";


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  formChangePass!: FormGroup
  formEditProfile!: FormGroup
  data = localStorage.getItem("user")

  // @ts-ignore
  user: Users = JSON.parse(this.data)
  listFriend: Users[] = [];
  listNotification: Notifications[] = [];
  timeNotificationMoment: any[] = [];
  countOther: any[] = [];
   imageFile: any;
   pathName!: string;

  constructor(private userService: UserService,
              private router:Router,
              private storage:AngularFireStorage,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.onMoveTop()
    this.formChangePass = new FormGroup({
      oldPass: new FormControl('', [Validators.required,Validators.pattern('^[a-zA-Z0-9]*$'), Validators.minLength(6), Validators.maxLength(32)]),
      newPass: new FormControl('', [Validators.required,Validators.pattern('^[a-zA-Z0-9]*$'), Validators.minLength(6), Validators.maxLength(32)]),
      confirmPass: new FormControl('', [Validators.required,Validators.pattern('^[a-zA-Z0-9]*$'), Validators.minLength(6), Validators.maxLength(32)])
    })
    this.findAllFriend()
    this.formEditProfile = new FormGroup({
      id:new FormControl(''),
      username:new FormControl(''),
      password:new FormControl(''),
      confirmPassword:new FormControl(''),
      name: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required,Validators.pattern("^(.+)@(\\S+)$")]),
      phone: new FormControl('',[Validators.required,Validators.pattern("^[0-9]{10}$")]),
      birthday: new FormControl('',[Validators.required]),
      hobby: new FormControl('',[Validators.required]),
      address: new FormControl('',[Validators.required]),
    })
    this.formEditProfile.patchValue(this.user)
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

  saveProfile() {
    if (this.imageFile !== undefined) {
      const imagePath = `image/${this.imageFile.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(imagePath);
      this.storage.upload(imagePath, this.imageFile).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            const user = this.formEditProfile.value
            user.avatar = url
            this.userService.editProfile(user).subscribe(data => {
              window.localStorage.setItem("user", JSON.stringify(data));
              this.user = data
              Swal.fire(
                'Good job!',
                'You clicked the button!',
                'success'
              )
            })
          });
        })
      ).subscribe()
    } else {
      const user = this.formEditProfile.value
      user.img = null
      this.userService.editProfile( user).subscribe((data) => {
        window.localStorage.setItem("user", JSON.stringify(data));
        Swal.fire(
          'Good job!',
          'You clicked the button!',
          'success'
        )
      })
    }
  }

  onSubmit() {
    let userUpdate: UserUpdate = new UserUpdate()
    userUpdate.oldPassword = this.formChangePass.get('oldPass')?.value
    userUpdate.newPassword = this.formChangePass.get('newPass')?.value
    userUpdate.confirmNewPassword = this.formChangePass.get('confirmPass')?.value
    userUpdate.id = this.user.id
    this.userService.changePassword(userUpdate).subscribe(() => {

    })
  }


  findAllFriend() {
    // @ts-ignore
    this.userService.findAllFriend(this.user.id).subscribe((data) => {
      this.listFriend = data
      this.getAllNotification()
    })
  }
  submitAvatar(event: any) {
    this.imageFile = event.target.files[0];
    if (this.pathName !== this.imageFile.name) {
      this.pathName = this.imageFile.name
    }
  }
  logOut(){
    localStorage.removeItem("user");
    this.router.navigate(['']);

  }
  onMoveTop(){
    this.router.events.subscribe((event)=>{
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    })
  }

}
