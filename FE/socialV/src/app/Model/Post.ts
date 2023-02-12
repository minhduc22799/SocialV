// @ts-ignore
import {User} from "./Users";
import {PostStatus} from "./post-status";

export interface Post {
  id?:number,
  user?:User,
  content?:string,
  createAt?:Date,
  countLike?:number,
  countComment?:number,
  postStatus?:PostStatus
}
