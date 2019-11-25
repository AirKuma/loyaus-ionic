import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { API_ROOT } from '../app/config';
import { Camera, File, Transfer, FilePath } from 'ionic-native';

/*
  Generated class for the ImageService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
declare var cordova: any;

@Injectable()
export class ImageService {
  auth_token:any;

  constructor(public http: Http) {
    this.auth_token = localStorage.getItem('usertoken');
    console.log('Hello ImageService Provider');
  }

  public uploadItemImage(lastImage){

    // Destination URL
    var url = API_ROOT +"items/uploadimage";
  
    // File for Upload
    var targetPath = this.pathForImage(lastImage);
  
    // File name only
    var filename = lastImage;
  
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename},
      headers: this.authimageHeader
      
    };
  
    const fileTransfer = new Transfer();

        return fileTransfer.upload(targetPath, url, options);
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public destroyImage(id:string){
      return this.http.delete(API_ROOT + "uploadimage/"+ id,
      {
          headers: this.authHeader
      });
      // .map(res => {
      //     console.log(res);
      //     return res.json();
      // });
  }

  private get authHeader() {
      var headers:any = new Headers();
      headers.append('Content-Type', 'application/json');     
      headers.append('Authorization', 'Bearer ' + this.auth_token);
      return headers;
  }

  private get authimageHeader() {
      var headers:any = new Headers();   
      headers.append('Authorization', 'Bearer ' + this.auth_token);
      return headers;
  }

}
