import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PostDisplay} from "../Model/Post-display";
import {Post} from "../Model/Post";
import {ImagePost} from "../Model/image-post";
import {PostComment} from "../Model/post-comment";
import {Users} from "../Model/Users";

const apiUrl = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient) {}

  findAllPostNewFeed(users: any):Observable<any>{
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

  findCountLikeOnePost(post: Post):Observable<any> {
    return this.http.post<Post>(apiUrl + `/post/get/like`, post);
  }

  findCountCommentPost(posts: Post[]):Observable<any>{
      return this.http.post<Post[]>(apiUrl + `/post/comment`, posts);
}

  findCountCommentOnePost(post: Post):Observable<any> {
    return this.http.post<Post>(apiUrl + `/post/get/comment`, post);
  }
  findAllPostProfile(id:number):Observable<any>{
  return this.http.get<PostDisplay[]>(apiUrl+`/post/profile/${id}`);
}
  findAllPostWallFriend( idFriend:number, idUser:number):Observable<any>{
    return this.http.get<PostDisplay[]>(apiUrl+`/post/wall/${idFriend}/${idUser}`);
  }

  deletePost(id:number):Observable<any>{
    return this.http.delete<any>(apiUrl+`/post/${id}`);
  }


  createPost(post: Post): Observable<any>{
    return this.http.post<Post>(apiUrl + `/post`, post);
  }

  getAllPostStatus(): Observable<any>{
    return this.http.get<any>(apiUrl + `/post/status`);
  }

  createPostImg(imagePost: ImagePost[]): Observable<any>{
    return this.http.post<any>(apiUrl + `/post/create/img`, imagePost);
  }

  getPost(id: number | undefined): Observable<Post>{
    return this.http.get<Post>(apiUrl + `/post/get/${id}`);
  }

  getPostDisplay(id: number | undefined, id2: number | undefined): Observable<PostDisplay> {
    return this.http.get<PostDisplay>(apiUrl + `/post/display/get/${id}/${id2}`);
  }

  editPost(post: Post): Observable<any>{
    return this.http.put<any>(apiUrl + `/post`, post);
  }

  editImgPost(list: number[]): Observable<any>{
    return this.http.put<any>(apiUrl + `/post/image`, list)
  }

  getImg(id: any): Observable<ImagePost[]>{
    return this.http.get<ImagePost[]>(apiUrl + `/post/image/${id}`)
  }

  getListLikePost(post: Post): Observable<Users[]>{
    return this.http.post<Users[]>(apiUrl + `/post/list/get/like`, post);
  }

  likePost(idUser?:number, idPost?:number): Observable<any>{
    return this.http.get<any>(apiUrl +`/post/interact/like/${idUser}/${idPost}`)
  }
  getListComment(id:number | undefined):Observable<PostComment[]> {
    return this.http.get<PostComment[]>(apiUrl +`/post/${id}/comment`)

  }
  getAllListComment(posts: Post[]):Observable<any>{
    return this.http.post<any>(apiUrl +`/post/list/comment`,posts)

  }
  addComment(postComment:PostComment):Observable<PostComment>{
    return this.http.post<PostComment>(apiUrl +`/post/interact/comment`,postComment)
  }

  deleteComment(id:number):Observable<any>{
    return this.http.delete<any>(apiUrl +`/post/comment/${id}`)
  }

  editComment(id:number,postComment:PostComment):Observable<any>{
    return this.http.put<any>(apiUrl +`/post/comment/${id}`,postComment)
  }
  getCommentById(id:number):Observable<any>{
    return this.http.get<any>(apiUrl +`/post/interact/comment/${id}`)
  }

  getCountComment(postsComment:PostComment[][]):Observable<any>{
    return this.http.post<any>(apiUrl +`/post/comment/countlike`,postsComment)
  }

  getCountCommentOnePost(postsComment:PostComment[]):Observable<any>{
    return this.http.post<any>(apiUrl +`/post/comment/countlike/get`,postsComment)
  }

  getCheckLikeComment(postsComment: PostComment[][], id: number | undefined):Observable<any> {
    return this.http.post<any>(apiUrl + `/post/comment/check/like/${id}`, postsComment)
  }

  getCheckLikeCommentOnePost(postsComment: PostComment[], id: number | undefined):Observable<any> {
    return this.http.post<any>(apiUrl + `/post/comment/check/like/get/${id}`, postsComment)
  }

  likeComment(idUser:number, idCmt:number):Observable<any>{
    return this.http.get<any>(apiUrl +`/post/interact/comment/like/${idUser}/${idCmt}`)
  }
}
