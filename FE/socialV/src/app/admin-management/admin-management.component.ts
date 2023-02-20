import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
// @ts-ignore
import {Users} from "../model/Users";
import {UserService} from "../service/user.service";
import {Observable} from "rxjs";
import {user} from "@angular/fire/auth";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
})
export class AdminManagementComponent implements OnInit {
  userList: Users[] = []
  user!: Users


  constructor(private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.userService.showAllUser().subscribe((data) => {
      {
        this.userList = data
      }
    })
  }

  blockAndActiveUser(id: number) {
    this.userService.findUserById(id).subscribe(data1 => {
      this.user = data1
      console.log(this.user)
      this.userService.blockAndActive(this.user).subscribe(() => {
      })
    })

  }
}
