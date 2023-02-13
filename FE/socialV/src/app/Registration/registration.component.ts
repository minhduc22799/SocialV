import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Users} from "../Model/Users";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit{
  registerForm!:FormGroup
  user!:Users


  constructor(private userService:UserService,
              private router:Router,
              private routerActive:ActivatedRoute) {
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
      this.router.navigate(['/Login']);
    }, err => {
      console.log(err);
      this.router.navigate(['/Login']);
    });
    console.log(this.user);
  }


}
