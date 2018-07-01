import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {  HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../_models/User';
import { Http , RequestOptions ,Headers} from '@angular/http';

@Injectable()
export class UserService {
baseUrl = environment.apiUrl;
constructor(private http: Http) { }

getUsers(): Observable<User[]> {
  return this.http.get(this.baseUrl + 'users',this.jwt())
  .map(res => <User[]>res.json())
  .catch(this.handleError);
}
private jwt(){
  let token = localStorage.getItem('token');
  if(token){
    let headers = new Headers({'Authorization': 'Bearer ' + token});
    headers.append('Content-type', 'application/json');
    return new RequestOptions({headers: headers});
  }
}
private handleError(error: any) {
  const applicationError = error.headers.get('Application-Error');
  if (applicationError) {
    return Observable.throw(applicationError);
  }
  const serverError = error.json();
  let modelStateErrors = '';
  if (serverError) {
    for (const key in serverError) {
      if (serverError[key]) {
        modelStateErrors += serverError[key] + '\n';
      }
    }
  }
  return Observable.throw(
    modelStateErrors || 'Server error'
  );
}
}
