import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
//import { Observable } from "rxjs/Observable";
//import { Storage } from '@ionic/storage';
import { API_ROOT } from '../app/config';
import * as localforage from "localforage";


/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {
  public local: Storage;
  client_id:string = "gsaddfdsfassgg322431";
  client_secret:string = "sfdsgfd423tergfdgfadg";
  auth_status:string = "";
  is_auth_error:boolean = false;
  user_activate:number;
  auth_token:{ header_name : string, header_value: string} = {header_name: '', header_value: ''};

  constructor(public http: Http) {
    //this.local = new Storage();
  }

  get tokenUrl() {
      return API_ROOT + "oauth/access_token";
  }

  public getAuthToken(username, password) {
        
        let creds = `username=${username}` +
            `&password=${password}` +
            `&grant_type=password` +
            `&client_id=${this.client_id}` +
            `&client_secret=${this.client_secret}`;
        console.log(creds);
        let header = new Headers();
        header.append('Content-Type', 'application/x-www-form-urlencoded');
        
        var $obs = this.http.post(this.tokenUrl, creds, {
                headers: header
            })
            .map(res => this.getToken(res));
          $obs.subscribe(
                data => {
                    //this.setTokenHeader(data),
                    //this.setUserInfoStorage()
                },
                err => {
                    console.log('Error')
                },
                () => console.log('Finish Auth'));
          return $obs;    
    }

    private getToken(res) {
        console.log(res);
        return res.json().access_token;
       // return 'DOFLcCwRrkSfZ4Emja8z2U9IGVTIXUng56z1OPjj';
    }

    public setTokenHeader(token) {
        if (token) {
            // 我想把這完全換成localStorage
            //this.local.set('token', token);
            console.log(token); 
            localStorage.setItem('usertoken', token);  
            this.auth_token.header_name = "Authorization";
            this.auth_token.header_value = "Bearer " + token;
            console.log(localStorage.getItem('usertoken')); 
            console.log("TOKEN"); 
        }
    }

    public checkToken(){
     // return this.local.get('token');
     console.log(localStorage.getItem('usertoken')); 
     return localStorage.getItem('usertoken');
    }

    public postRegister(data){
        let link = API_ROOT+"users";
        return this.http.post(link , data)
            .map(res => res.json())
    }

    public LoadMajorData(){
    let url = API_ROOT+"majors";
    console.log(url);
    return this.http.get(url)
        .map((res : Response) => res.json())
  }

    private get authHeader() {
        var authHeader = new Headers();
        authHeader.append(this.auth_token.header_name, this.auth_token.header_value);
        return authHeader;
    }
    // authHeader1() {
    //     return <string>this.local.get('token')    
    // }


    // public setUserInfoStorage(){
    //     let url = API_ROOT+"me";
    //     console.log(url);
    //     console.log(this.authHeader);
    //     return this.http.get(url,
    //     {
    //         headers: this.authHeader
    //     }).map((res : Response) => res.json()).subscribe(
    //             data => {
    //                 console.log(data); 
    //                 //this.local.set('user', data.data[0]);
    //                 localforage.setItem('user', data.data[0]);
    //                 // localforage.getItem('user').then((user) => {
    //                 //     console.log(user['email']);  
    //                 // })
    //                 console.log("USER");      
    //             },
    //             err => {
    //                 console.log('Error')
    //             },
    //             () => console.log('Finish Auth'));
    // }

     public setUserInfoStorage(){
        let url = API_ROOT+"me";
        console.log(url);
        console.log(this.authHeader);
        return this.http.get(url,
        {
            headers: this.authHeader
        }).map((res : Response) => res.json())
    }
    

    isLogin(){
        if(localStorage.getItem('usertoken'))
            return true
        else
            return false
    }

    public isEmailUnique(email){
        let url = API_ROOT+"users/"+email+"/ifemailunique";
        console.log(url);
        return this.http.get(url)
            .map((res : Response) => res.json())
    }

}
