import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Users} from "../Model/Users";
import {Observable} from "rxjs";
const API_URL='http://localhost:8080'
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient:HttpClient) { }

  register(user: any): Observable<any> {
    return this.httpClient.post<any>(API_URL + '/signUp', user);
  }
  login(user: any): Observable<any> {
    return this.httpClient.post<any>(API_URL + '/login', user);
  }

  findUserById(id: number): Observable<Users> {
    return this.httpClient.get<Users>(`${API_URL}/user/${id}`)
  }

  findAllFriend(id: number | undefined):Observable<Users[]>{
    return this.httpClient.get<Users[]>(`${API_URL}/user/friend/${id}`)
  }
}