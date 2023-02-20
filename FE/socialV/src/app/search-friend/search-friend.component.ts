import {Component, OnInit} from '@angular/core';
import {Users} from "../Model/Users";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {NavigationEnd, Router} from "@angular/router";
import {PostService} from "../PostService/post.service";
import {UserService} from "../service/user.service";
import {Observable} from "rxjs";

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
  // @ts-ignore
  listSearchFriend:Users[]= JSON.parse(localStorage.getItem("listUser"))
  // @ts-ignore
  search:string= JSON.parse(localStorage.getItem("nameUser"))


  ngOnInit(): void {
    // @ts-ignore
    this.findAllFriend()
    // this.onMoveTop()
    this.findListRequest()
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
              private router: Router) {

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
    })
  }

  searchUserByNameContaining(name:string){
    this.userService.findUsersByNameContaining(name).subscribe(data=>{
        this.listSearchFriend=data
    })
  }


}
