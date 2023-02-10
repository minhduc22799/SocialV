import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PostDisplay} from "../Model/Post-display";

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

}
