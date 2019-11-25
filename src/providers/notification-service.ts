import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
//import { Storage } from '@ionic/storage';
import { API_ROOT } from '../app/config';

/*
  Generated class for the NotificationService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NotificationService {
  //public local: Storage;
  auth_token:any;

  constructor(public http: Http) {
    // this.local = new Storage();
    // this.local.get('token').then((val) => {
    //   this.auth_token = val;
    // });
    this.auth_token = localStorage.getItem('usertoken');
    console.log("111"+this.auth_token);
  }

  LoadNotificationData(limit:number, offset:number){
    let url = API_ROOT+"notifications?limit="+ limit +"&offset="+ offset;

    console.log(this.authHeader);

    return this.http.get(url,{
         headers: this.authHeader
    }).map((res : Response) => res.json())
    
  }

  private get authHeader() {
      var headers:any = new Headers();
      headers.append('Content-Type', 'application/json');     
      headers.append('Authorization', 'Bearer ' + this.auth_token);
      return headers;
  }

}
