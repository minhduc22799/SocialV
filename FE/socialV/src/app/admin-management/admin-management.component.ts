import {Component, OnInit} from '@angular/core';
// @ts-ignore
import {Users} from "../model/Users";
import {UserService} from "../service/user.service";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
})
export class AdminManagementComponent implements OnInit {
  userList: Users[] = []
  user!: Users
  count: number[] = []
  page :number=1
  pageSize :number=20;
  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.showAllUser().subscribe((data) => {
      this.userList = data
      this.countFriends(data)
    })
  }


  blockAndActiveUser(id: number) {
    Swal.fire({
      title: 'Are You Sure ?',
      icon: 'question',
      iconHtml: '?',
      confirmButtonText: 'YES',
      cancelButtonText: 'CANCEL',
      showCancelButton: true,
      showCloseButton: true
    }).then((rs) => {
      if (rs.isConfirmed) {
        this.userService.findUserById(id).subscribe(data1 => {
          this.user = data1
          if (this.user.status == true) {
            this.userService.blockAndActive(this.user).subscribe(() => {
            })
          } else if (this.user.status == false) {
            this.userService.blockAndActive(this.user).subscribe(() => {
            })
          }
        })
      }location.reload()

    })
  }

  countFriends(user: Users[]) {
    // @ts-ignore
    this.userService.countFriend(user).subscribe(data => {
      this.count = data
    })
  }



}
