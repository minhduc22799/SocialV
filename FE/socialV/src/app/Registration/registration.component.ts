import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Users} from "../Model/Users";
import Swal from "sweetalert2";


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit{
  registerForm!:FormGroup
  user!:Users
  dateCurrent = new  Date()
  maxDate?: string;



  constructor(private userService:UserService,
              private router:Router,
              private routerActive:ActivatedRoute) {
    this.maxDate = this.dateCurrent.toISOString().substring(0, 10);
  }
  ngOnInit(): void {
    this.registerForm =new FormGroup({
      username: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z0-9]*$')]),
      password: new FormControl('', [Validators.required,Validators.pattern('^[a-zA-Z0-9]*$'), Validators.minLength(6), Validators.maxLength(32)]),
      confirmPassword: new FormControl('', [Validators.required,Validators.pattern('^[a-zA-Z0-9]*$'), Validators.minLength(6), Validators.maxLength(32)]),
      name: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required,Validators.pattern("^(.+)@(\\S+)$")]),
      phone: new FormControl('',[Validators.required,Validators.pattern("^[0-9]{10}$")]),
      birthday: new FormControl('',[Validators.required])
    })

  }
  register() {
    this.user = this.registerForm.value;
    this.userService.register(this.user).subscribe(() => {
      console.log('Đăng ký thành công');
      this.router.navigate(['']);
    }, err => {
      Swal.fire({
        icon: 'error',
        text: 'Username or email already exists'
      })
    });
  }


}
