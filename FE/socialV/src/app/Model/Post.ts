// @ts-ignore
import {Users} from "./Users";
import {PostStatus} from "./post-status";

export interface Post {
  id?:number,
  users?:Users,
  content?:string,
  createAt?:Date,
  postStatus?:PostStatus
}
