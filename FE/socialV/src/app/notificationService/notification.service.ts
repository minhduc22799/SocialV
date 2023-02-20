import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Notifications} from "../Model/notifications";

const apiUrl = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) {
  }

  getNotification(id: number | undefined): Observable<Notifications[]> {
    return this.http.get<Notifications[]>(apiUrl + `/notification/${id}`);
  }

  seenNotification(id: number | undefined): Observable<any> {
    return this.http.get<any>(apiUrl + `/notification/seen/${id}`)
  }

  countOther(notification: Notifications[]): Observable<any> {
    return this.http.post<any>(apiUrl + `/notification/other`, notification);
  }
}
