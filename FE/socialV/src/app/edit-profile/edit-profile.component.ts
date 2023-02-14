import {Component, OnInit} from '@angular/core';
import {UserService} from "../service/user.service";
import { FormControl, FormGroup} from "@angular/forms";
// @ts-ignore
import {Users} from "../model/Users";
import {UserUpdate} from "../model/UserUpdate";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  formChangePass!: FormGroup
  data = localStorage.getItem("user")

  // @ts-ignore
  user: Users = JSON.parse(this.data)

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.formChangePass = new FormGroup({
      oldPass: new FormControl(''),
      newPass: new FormControl(''),
      confirmPass: new FormControl('')
    })
  }


  onSubmit() {
    let userUpdate: UserUpdate = new UserUpdate()
    userUpdate.oldPassword = this.formChangePass.get('oldPass')?.value
    userUpdate.newPassword = this.formChangePass.get('newPass')?.value
    userUpdate.confirmNewPassword = this.formChangePass.get('confirmPass')?.value
    userUpdate.id=this.user.id
         this.userService.changePassword(userUpdate).subscribe((data)=>{
           userUpdate=data
         })
      }

}
