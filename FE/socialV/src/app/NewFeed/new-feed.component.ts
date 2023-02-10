import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {PostDisplay} from "../Model/Post-display";
import {PostService} from "../PostService/post.service";
import {UserService} from "../service/user.service";
import {Users} from "../Model/Users";

@Component({
  selector: 'app-newfeed',
  templateUrl: './new-feed.component.html',
  styleUrls: ['./new-feed.component.css']
})
export class NewFeedComponent implements OnInit,AfterViewInit{
  ngAfterViewInit(): void {    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "assets/js/libs.min.js";
    this.elementRef.nativeElement.appendChild(s);
  }


   postsDisplay:PostDisplay[] = [];

  ngOnInit(): void {
    // @ts-ignore
    this.findAll()
  }
  constructor(private postService:PostService,
              private userService: UserService,
              private elementRef:ElementRef) {
  }

  findAll(){
    this.userService.findUserById(1).subscribe((data)=>{
      localStorage.setItem("user",JSON.stringify(data))
      // @ts-ignore
      console.log(data)
      this.postService.findAllPostNewFeed(data).subscribe((post)=>{
        this.postsDisplay = post
        console.log(this.postsDisplay)
      })
    })

  }
}
