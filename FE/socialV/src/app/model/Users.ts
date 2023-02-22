import {Role} from "./Role";

export interface Users{
  id?:number
  username?:string
  password?:string
  confirmPassword?:string
  name?:string
  email?:string
  phone?:string
  birthday?:string
  status?:boolean
  checkOn?:boolean
  seeFriendPermission?:boolean
  commentPermission?:boolean
  avatar?:string
  address?:string
  hobby?:string
  role?:Role
}
