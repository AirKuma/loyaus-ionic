import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
//import { Observable } from "rxjs/Observable";
//import { Storage } from '@ionic/storage';
import { API_ROOT } from '../app/config';


/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService {
  auth_token:any;
  //public local: Storage;
  headers:any;

  constructor(public http: Http) {
    // this.local = new Storage();
    // this.local.get('token').then((val) => {
    //   //this.auth_token = val;
    //   // this.headers = new Headers();
    //   // this.headers.append('Content-Type', 'application/json'); 
    //   // console.log(this.headers);
    // })
    console.log(localStorage.getItem('usertoken')) ;
    this.auth_token = localStorage.getItem('usertoken');

  //   .then(() => {
  //     console.log(this.auth_token);    
  // this.headers.append('Authorization', 'Bearer ' + this.auth_token);
  //  console.log(this.headers);

  //   });
    





  }

  loadUserData(){
    //console.log("LO" +localStorage.getItem('token')) ;
    let url = API_ROOT+"me";
    console.log(url);
    console.log(this.authHeader);
    return this.http.get(url,
    {
         headers: this.authHeader
    })
    .map((res : Response) => res.json())
  }


  LoadMyItemData(limit:any, offset:any){

    let url = API_ROOT+"me/items?limit="+ limit +"&offset="+ offset;
    console.log(url);
    console.log(this.authHeader);
    return this.http.get(url,
    {
         headers: this.authHeader
    })
    .map((res : Response) => res.json())
  }

   LoadMyBidItemData(limit:any, offset:any){

    let url = API_ROOT+"me/bids?limit="+ limit +"&offset="+ offset;
    console.log(url);
    return this.http.get(url,
    {
         headers: this.authHeader
    })
    .map((res : Response) => res.json())
  }

  public postRegister(data){
        let link = API_ROOT+"users";
        return this.http.post(link , data)
            .map(res => res.json())
    }

  public postEditProfile(data){

      return this.http.put(API_ROOT + "me",data,
      {
          headers: this.authHeader
      })
      .map(res => {
          console.log(res);
          return res.json();
      });

  }

  public postEditPassword(data){

      return this.http.put(API_ROOT + "me/password",data,
      {
          headers: this.authHeader
      })
      .map(res => {
          console.log(res);
          return res.json();
      });

  }

  LoadUserContactData(id:number)
  {
    let url = API_ROOT+"users/"+ id;
    console.log(url);
    return this.http.get(url)
    .map((res : Response) => res.json())
  }

  public isUsernameUnique(username){
        let url = API_ROOT+"me/"+username+"/ifusernameunique";
        console.log(url);
        return this.http.get(url)
            .map((res : Response) => res.json())
  }

  public checkCurrentPawword(password){
    let url = API_ROOT+"me/password?old_password="+password;
    return this.http.get(url,
    {
         headers: this.authHeader
    })
    .map((res : Response) => res.json())
  }

  public postReadNotification(){
    let link = API_ROOT+"notifications/me/count";
    return this.http.post(link , null,
    {
      headers: this.authHeader
    })
            .map(res => res.json())
    }

  public getReadNotification(){
    let url = API_ROOT+"notifications/me/count";
    return this.http.get(url,
    {
         headers: this.authHeader
    })
    .map((res : Response) => res.json())
  }

  public postReadMessage(){
    let link = API_ROOT+"messages/me/count";
    return this.http.post(link , null,
    {
      headers: this.authHeader
    })
            .map(res => res.json())
    }

  public getReadMessage(){
    let url = API_ROOT+"messages/me/count";
    return this.http.get(url,
    {
         headers: this.authHeader
    })
    .map((res : Response) => res.json())
  }

  private get authHeader() {
      var headers:any = new Headers();
      headers.append('Content-Type', 'application/json');     
      headers.append('Authorization', 'Bearer ' + this.auth_token);
      return headers;
  }


}
