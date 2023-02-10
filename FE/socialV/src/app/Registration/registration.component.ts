import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
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
      username: new FormControl(''),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      birthday: new FormControl('')
    })

  }
  register() {
    this.user = this.registerForm.value;
    this.userService.register(this.user).subscribe(() => {
      console.log('Đăng ký thành công');
      this.router.navigate(['/Login']);
    }, err => {
      console.log(err);
    });
    console.log(this.user);
  }


}
