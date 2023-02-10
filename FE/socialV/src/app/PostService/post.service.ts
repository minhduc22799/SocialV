import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
const apiUrl = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpClient:HttpClient) {}
  findAllPostNewFeed():Observable<[]>{
    return this.httpClient.get<[]>(`${apiUrl}/species`)
  }
}
