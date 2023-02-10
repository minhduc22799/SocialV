// @ts-ignore
import { Users} from "./Users";
import {PostStatus} from "./post-status";

export interface PostDisplay {
  id?:number,
  user?:Users,
  content?:string,
  createAt?:Date,
  countLike?:number,
  countComment?:number,
  postStatus?:PostStatus,
  checkUserLiked?:boolean
}
