import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Users} from "../Model/Users";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Conversation} from "../Model/conversation";
import {Messages} from "../Model/message";

const apiUrl = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) {
  }

  getAllPersonalConversation(user: Users): Observable<any> {
    return this.http.get<Conversation[]>(apiUrl + `/chat/room/${user.id}`);
  }

  getAllGroupConversation(user: Users): Observable<any> {
    return this.http.get<Conversation[]>(apiUrl + `/chat/room/group/${user.id}`);
  }

  getMessage(id: number | undefined): Observable<any> {
    return this.http.get<Messages[]>(apiUrl + `/chat/message/${id}`);
  }

  findAllMemberInConversation(conversations: Conversation[]): Observable<any>{
    return this.http.post<Users[][]>(apiUrl + `/chat/member`, conversations);
  }

  sendMessage(message: Messages): Observable<any>{
    return this.http.post<any>(apiUrl + `/chat`, message);
  }

}
