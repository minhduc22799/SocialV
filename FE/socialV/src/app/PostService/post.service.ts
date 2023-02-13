import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PostDisplay} from "../Model/Post-display";
import {Post} from "../Model/Post";
import {Users} from "../Model/Users";

const apiUrl = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient) {}

  findAllPostNewFeed(users: any):Observable<any>{
    console.log(apiUrl+`/post`)
    return this.http.get<PostDisplay[]>(apiUrl+`/post/${users.id}`);
  }

  findAllImgPost(posts: Post[]):Observable<any>{
    return this.http.post<Post[]>(apiUrl + `/post/image`, posts);
  }

  findLikePost(posts: Post[]):Observable<any>{
    return this.http.post<Post[]>(apiUrl + `/post/list/like`, posts);
  }
  findCountLikePost(posts: Post[]):Observable<any> {
    return this.http.post<Post[]>(apiUrl + `/post/like`, posts);
  }

  findCountCommentPost(posts: Post[]):Observable<any>{
      return this.http.post<Post[]>(apiUrl + `/post/comment`, posts);
}

findAllPostProfile(id:number):Observable<any>{
  return this.http.get<PostDisplay[]>(apiUrl+`/post/profile/${id}`);
}

}
