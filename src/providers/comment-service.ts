import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx'
//import { Storage } from '@ionic/storage';
import { API_ROOT } from '../app/config'

/*
  Generated class for the CommentService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CommentService {
  //public local: Storage;
  auth_token:any;

  constructor(public http: Http) {
    // this.local = new Storage();
    // this.local.get('token').then((val) => {
    //   this.auth_token = val;
    // }); 
    this.auth_token = localStorage.getItem('usertoken');
    console.log(this.auth_token);
  }

  public postComment(content,id:number){

      // var auth_token:any;
      var headers:any = new Headers();
      // this.local.get('token').then((val) => {
      //   this.auth_token = val;
      // }); 
      headers.append('Content-Type', 'application/json');     
      headers.append('Authorization', 'Bearer ' + this.auth_token);
      
      console.log(this.auth_token);

       let content_js = JSON.stringify({content: content });

        return this.http.post(API_ROOT + "items/"+ id +"/comment", content_js,
            {
                headers: headers
            })
            .retry(3)
            .map(res => {
                console.log(res);
                return res.json();
            });
  }

  public postReport(content,id:number){

      let report_js = JSON.stringify({content: content });

      return this.http.post(API_ROOT + "comments/"+ id +"/report", report_js ,
      {
          headers: this.authHeader
      })
      .map(res => {
          console.log(res);
          return res.json();
      });
  }

  public destroyComment(id:number){
      return this.http.delete(API_ROOT + "comments/"+ id,
      {
          headers: this.authHeader
      })
      .map(res => {
          console.log(res);
          return res.json();
      });
  }

  private get authHeader() {
      var headers:any = new Headers();
      headers.append('Content-Type', 'application/json');     
      headers.append('Authorization', 'Bearer ' + this.auth_token);
      return headers;
  }

}
