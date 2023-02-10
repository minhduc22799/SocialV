import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Users} from "../model/Users";
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm!:FormGroup
  user!:Users


  constructor(private userService:UserService,
              private router:Router) {
  }
  ngOnInit(): void {
    this.loginForm = new FormGroup({
    username: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z0-9]*$')]),
    password: new FormControl('', [Validators.required,Validators.pattern('^[a-zA-Z0-9]*$'), Validators.minLength(6), Validators.maxLength(32)])
  });
  }
  login(){
      this.user=this.loginForm.value
      this.userService.login(this.user).subscribe(user=>{
        window.localStorage.setItem("user", JSON.stringify(user));
        console.log("Đăng nhập thành công");
        this.router.navigate(['/NewFeed']);
      })
  }
}
