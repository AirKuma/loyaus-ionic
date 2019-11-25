import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { API_ROOT } from '../app/config';
import { Camera, File, Transfer, FilePath } from 'ionic-native';

/*
  Generated class for the AuctionService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
declare var cordova: any;

@Injectable()
export class AuctionService {
  auth_token:any;

  constructor(public http: Http) {
    this.auth_token = localStorage.getItem('usertoken');
    console.log(this.auth_token);
  }

  LoadItemData(type:string, college:number, category:string, limit:any, offset:any, fields:any){

    let url = API_ROOT+"items?type="+ type +"&college="+ college +"&category="+ category +"&limit="+ limit +"&offset="+ offset +"&fields=" +fields;
    console.log(url);
    console.log(this.authHeader);
    return this.http.get(url,
    {
         headers: this.authHeader
    })
    .map((res : Response) => res.json())
  }

  LoadDetail(id:number){
    let url = API_ROOT+"items/"+id;
    console.log(this.authHeader);
    return this.http.get(url,
    {
         headers: this.authHeader
    })
    .map((res : Response) => res.json())
  }

  public postItem(data, type:string){

        let link = API_ROOT+"items?Itemtype="+ type;
        return this.http.post(link , data,
        {
            headers: this.authHeader
        })
        .map(res => res.json())
  }

  LoadItemCommentData(id:number, limit:any, offset:any){
    let url = API_ROOT+"items/"+ id + "/comment?limit="+ limit +"&offset="+ offset;
    console.log(url);
    return this.http.get(url)
        .map((res : Response) => res.json())
  }

  LoadItemBidData(id:number, limit:any, offset:any){
    let url = API_ROOT+"items/"+ id + "/bid?limit="+ limit +"&offset="+ offset;
    console.log(url);
    return this.http.get(url)
        .map((res : Response) => res.json())
  }

  LoadItemCategoryData(type:string){
    let url = API_ROOT+"items/" + type + "/categories";
    return this.http.get(url)
        .map((res : Response) => res.json())
  }

  public postBid(price,id:number){
      
      let price_js = JSON.stringify({price: price });

      return this.http.post(API_ROOT + "items/"+ id +"/bid", price_js,
          {
              headers: this.authHeader
          })
          .map(res => {
              console.log(res);
              return res.json();
          });

  }

  public postFree(id:number){

      return this.http.post(API_ROOT + "items/"+ id +"/free", null ,
      {
          headers: this.authHeader
      })
      .map(res => {
          console.log(res);
          return res.json();
      });
  }

  public postReport(content,id:number){

      let report_js = JSON.stringify({content: content });
      console.log(this.authHeader);

      return this.http.post(API_ROOT + "items/"+ id +"/report", report_js ,
      {
          headers: this.authHeader
      })
      .map(res => {
          console.log(res);
          return res.json();
      });
  }

  public postRepost(id:number){

      return this.http.post(API_ROOT + "items/"+ id +"/repost", null,
      {
          headers: this.authHeader
      })
      .map(res => {
          console.log(res);
          return res.json();
      });
  }

  public destroyItem(id:number){
      return this.http.delete(API_ROOT + "items/"+ id,
      {
          headers: this.authHeader
      })
      .map(res => {
          console.log(res);
          return res.json();
      });
  }

  public destroyItemImage(id:number,publicid:string ,type:string){
      return this.http.delete(API_ROOT + "items/image/"+ id +"?auction=" +type+"&publicid="+publicid,
      {
          headers: this.authHeader
      })
      .map(res => {
          console.log(res);
          return res.json();
      });
  }

  public putEditItem(data, id){

      console.log(API_ROOT + "items/" +id);
      return this.http.put(API_ROOT + "items/" +id ,data,
      {
          headers: this.authHeader
      })
      .map(res => {
          console.log(res);
          return res.json();
      });

  }

  public uploadImage(lastImage,id){

    // Destination URL
    var url = API_ROOT + "items/" +id+"/image";
  
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

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public postfavor(id:number){

      return this.http.post(API_ROOT + "items/"+ id +"/favor", null ,
      {
          headers: this.authHeader
      })
      .map(res => {
          console.log(res);
          return res.json();
      })
  }

  public getIffavor(id:number){

      return this.http.get(API_ROOT + "items/"+ id +"/iffavor" ,
      {
          headers: this.authHeader
      })
      .map((res : Response) => res.json())
  }

  LoadItemImageData(id:number){
    let url = API_ROOT+"items/"+ id + "/image";
    console.log(url);
    return this.http.get(url)
        .map((res : Response) => res.json())
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
