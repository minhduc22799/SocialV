import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
// @ts-ignore
import {Users} from "../model/Users";
import {UserService} from "../service/user.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  loginAdminForm!: FormGroup
  user!: Users

  constructor(private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loginAdminForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]),
      password: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$'), Validators.minLength(6), Validators.maxLength(32)]),
      role:new FormGroup({
        id:new FormControl(2.0),
        name:new FormControl('ROLE_ADMIN')
      })
    });
  }
  loginAdmins(){
    this.user=this.loginAdminForm.value
    console.log(this.user)
    this.userService.loginAdmin(this.user).subscribe(()=>{
      this.router.navigate(['/AdminManagement']);
    }, err => {
      Swal.fire({
        icon: 'error',
        text: 'Login failed'
      })
    });
  }


}
