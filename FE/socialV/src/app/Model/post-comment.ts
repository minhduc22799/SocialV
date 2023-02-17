import {Users} from "./Users";
import {Post} from "./Post";

export interface PostComment {
  id:number,
  users:Users,
  post:Post,
  content: string
}
