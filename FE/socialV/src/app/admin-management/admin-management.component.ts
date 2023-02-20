import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
// @ts-ignore
import {Users} from "../model/Users";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']
})
export class AdminManagementComponent implements OnInit{
  userList:Users[]=[]
  user!:Users

  constructor(private userService:UserService) {
  }
  ngOnInit(): void {
      this.userService.showAllUser().subscribe((data)=>{{
        this.userList=data
      }})
  }
    blockAndActiveUser(){
    // console.log(this.user)
        this.userService.blockAndActive(this.user).subscribe((data)=>{
              this.user=data
        })
    }
}
