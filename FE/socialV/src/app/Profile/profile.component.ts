import {Component, OnInit} from '@angular/core';
import {Users} from "../Model/Users";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  data = localStorage.getItem("user")
  // @ts-ignore
  user:Users = JSON.parse(this.data)
  listFriend:Users[] = [];

  ngOnInit(): void {
    this.findAllFriend()
  }

  constructor( private userService: UserService  ) {
  }
  findAllFriend(){
    // @ts-ignore
    this.userService.findAllFriend(this.user.id).subscribe((data)=>{
      this.listFriend = data
    })
  }
}
