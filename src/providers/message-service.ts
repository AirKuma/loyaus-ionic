import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { API_ROOT } from '../app/config';
/*
  Generated class for the MessageService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MessageService {
  auth_token:any;

  constructor(public http: Http) {
    this.auth_token = localStorage.getItem('usertoken');
  }

  LoadThreadsData(limit:number, offset:number){
    let url = API_ROOT+"threads?limit="+ limit +"&offset="+ offset;

    return this.http.get(url,{
         headers: this.authHeader
    }).map((res : Response) => res.json())
    
  }

  public getIfThread(id){

    let url = API_ROOT+"ifthread/"+id;
    console.log(url);
    return this.http.get(url,
    {
        headers: this.authHeader
    })
    .map((res : Response) => res.json())
  }

  public postCreateThread(id){
    let link = API_ROOT+"threads/"+id;
    return this.http.post(link , null,
    {
        headers: this.authHeader
    })
    .map(res => res.json())
  }

  public LoadMessageData(limit:number, offset:number, id){

    let url = API_ROOT+"messages/"+ id +"?limit="+ limit +"&offset="+ offset;
    console.log(url);
    return this.http.get(url,
    {
        headers: this.authHeader
    })
    .map((res : Response) => res.json())
  }

  public postCreateMessage(body,id){
    
    let body_js = JSON.stringify({body: body });
    let link = API_ROOT+"messages?id="+id;

    return this.http.post(link , body_js,
    {
        headers: this.authHeader
    })
    .map(res => res.json())
  }

  public postThreadRead(id){
    
    let link = API_ROOT+"threads/"+id+"/read";

    return this.http.post(link , null,
    {
        headers: this.authHeader
    })
    .map(res => res.json())
  }

  private get authHeader() {
      var headers:any = new Headers();
      headers.append('Content-Type', 'application/json');     
      headers.append('Authorization', 'Bearer ' + this.auth_token);
      return headers;
  }

}
