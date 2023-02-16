import {Component, OnInit} from '@angular/core';
import {PostService} from "../PostService/post.service";
import {Users} from "../Model/Users";
import {PostDisplay} from "../Model/Post-display";
import {ImagePost} from "../Model/image-post";
import {UserService} from "../service/user.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Post} from "../Model/Post";

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.component.html',
  styleUrls: ['./friend-profile.component.css']
})
export class FriendProfileComponent implements OnInit{
  data = localStorage.getItem("user")
  // @ts-ignore
  user:Users = JSON.parse(this.data)

  postsDisplayFriend:PostDisplay[] = [];
  listFriend:Users[] = [];
  listMutualFriend:Users[] = [];
  listFriendOfFriend:Users[] = [];
  listImgPost:ImagePost[][] = [];
  listFriendPost:Users[][] = [];
  listImg:any[] = [];
  countLike:any[] = [];
  countComment:any[] = [];
  // @ts-ignore
  friend:Users

  // @ts-ignore
  idFiend:number  = this.routerActive.snapshot.paramMap.get("id")


  ngOnInit(): void {
    this.findAllPostFriend()
    this.findAllFriend()
    this.findFriend()
    this.findFriendOfFriend()
    this.findMutualFriend()
    this.onMoveTop()
  }


  constructor( private postService:PostService,
               private userService: UserService,
               private routerActive: ActivatedRoute,
               private router:Router
                ) {
  }

  findAllPostFriend(){

    // @ts-ignore
    this.postService.findAllPostWallFriend(this.idFiend,this.user.id).subscribe(data=>{
        this.postsDisplayFriend = data
      this.findAllImgPost(data)
      this.findFriendLike(data)
      this.findCountLike(data)
      this.findCountComment(data)

    })
  }
  findFriend(){
    this.userService.findUserById(this.idFiend).subscribe(data =>{
      this.friend = data
      console.log(this.friend)
    })
  }

  findAllFriend(){
    // @ts-ignore
    this.userService.findAllFriend(this.user.id).subscribe((data)=>{
      this.listFriend = data
    })
  }

  findFriendLike(posts: Post[]){
    this.postService.findLikePost(posts).subscribe( like =>{
      this.listFriendPost = like
    })
  }
  findCountLike(posts: Post[]){
    this.postService.findCountLikePost(posts).subscribe(countLike =>{
      this.countLike = countLike
    })
  }

  findCountComment(posts: Post[]){
    this.postService.findCountCommentPost(posts).subscribe(countComment =>{
      this.countComment = countComment
    })
  }


  findAllImgPost(posts: Post[]){
    this.postService.findAllImgPost(posts).subscribe(img =>{
      this.listImgPost = img
      for (let i = 0; i < this.listImgPost.length; i++) {
        // @ts-ignore
        this.listImg[i] = [];
        for (let j = 0; j < this.listImgPost[i].length; j++) {
          // @ts-ignore
          let imageObject1 = {
            image:  this.listImgPost[i][j].img,
            thumbImage:  this.listImgPost[i][j].img,
          };
          this.listImg[i].push(imageObject1);
        }
      }
      console.log(this.listImg)
    })
  }


    findMutualFriend(){
      // @ts-ignore
      this.userService.findMutualFriends(this.idFiend,this.user.id).subscribe((data) =>{
        this.listMutualFriend = data
      })
    }

    findFriendOfFriend(){
        this.userService.findFriendOfFriend(this.idFiend).subscribe(data=>{
          this.listFriendOfFriend = data
        })
    }

    routerProfile(id?:number){
    this.router.navigate(['/friendProfile/'+ id])
      window.onload
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
