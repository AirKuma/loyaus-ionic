import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

import { ROOT } from '../../app/config';
import { MessageService } from "../../providers/message-service";
import * as localforage from "localforage";
///import * as io from 'socket.io-client';

/*
  Generated class for the MessageChat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-message-chat',
  templateUrl: 'message-chat.html',
  providers : [ MessageService ]
})
export class MessageChatPage {
  root:string = ROOT;
  public start:number;
  public limit:number=10;
  public  messagedatas:any;
  auth_user:any;

  public selectedId:number;
  public firstname:string;
  public lastname:string;
  body: any;

  private current;
  private pre;
  private spinner: any;
  private nodata: any;
  sandbutton:number=1;

  // socket:any;
  // zone:any;
  // socketHost: string = "http://45.55.22.181:3000/";

  constructor(public navCtrl: NavController, private messageService : MessageService, private navParam: NavParams , private viewCtrl : ViewController, public toastCtrl: ToastController) {
      this.messagedatas = [];
  }

  ionViewDidLoad() {
      this.body = "";
      this.selectedId = this.navParam.get('userid');
      this.firstname = this.navParam.get('firstname');
      this.lastname = this.navParam.get('lastname');
      this.spinner = 1;
      this.nodata = 1;
  }

  ionViewWillEnter() {
    localforage.getItem('user').then((user) => {
          this.auth_user = user[0].id;
          
    })
    this.start = 0;
    this.loadMessageDatas();
  }

  loadMessageDatas(){
    this.messageService.LoadMessageData(this.limit, this.start, this.selectedId)
      .subscribe(res => {
          this.messagedatas = res.data;
          if(this.messagedatas[0])
            this.postThreadRead(this.messagedatas[0].thread_id);
          this.spinner = 0;
          this.autoScroll();
      })
  }

  postThreadRead(id){
    this.messageService.postThreadRead(id)
      .subscribe(data =>{
        console.log(data);
      })
  }

  createMessage(){
    if(this.body != ""){
      this.sandbutton = 0;
      this.messageService.postCreateMessage(this.body, this.selectedId)
        .subscribe(data =>{
          console.log(data);
          this.start = 0;
          this.loadMessageDatas();
          this.body = "";
          this.sandbutton = 1;
        }, err=>{
          let toast = this.toastCtrl.create({
          message: '傳送訊息無效',
          duration: 3000,
          position: 'top',
          showCloseButton: true,
          closeButtonText: "關閉"
          });
          toast.present();
          this.sandbutton = 1;
        })
    }else{
      console.log("empty");
    }
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  // doInfinite(infiniteScroll) {

  //   setTimeout(() => {
  //     //this.limit+=10;
  //     this.start+=10;
      
  //     this.messageService.LoadMessageData(this.limit, this.start, this.selectedId)
  //         .subscribe(
  //         (res) => {
  //             if(res.data != ''){

  //               var itemList = document.getElementById("chat-autoscroll");
  //               this.pre = itemList.scrollHeight;
  //               console.log(this.pre);
            
  //               for (let x of res.data.reverse()){
  //                 this.messagedatas.unshift(x);
  //               }

  //               //this.messagedatas = res.data;
  //               this.messageService.LoadMessageData(this.messagedatas.length, 0, this.selectedId)
  //               .subscribe(
  //                 (res) => {
  //                   this.messagedatas = res.data;
  //               })

  //               this.start -= (10-res.data.length);
  //               this.nodata = 1;
  //               this.scrollToPre(this.pre);
                
  //             }else{
  //               if(this.nodata == 1){
  //                 let toast = this.toastCtrl.create({
  //                 message: '己經沒有資料',
  //                 duration: 1000
  //                 });
  //                 toast.present();
  //                 this.nodata = 0;
  //               }
  //               this.start -= 10;

  //               // this.messageService.LoadMessageData(this.messagedatas.length, 0, this.selectedId)
  //               // .subscribe(
  //               //   (res) => {
  //               //     this.messagedatas = res.data;
  //               // })
  //             }
  //         })
  //     infiniteScroll.complete();
  //   }, 1000);

  //   console.log(this.start);
  // }

  autoScroll() {
    setTimeout(function () {
        var itemList = document.getElementById("chat-autoscroll");
        itemList.scrollTop = itemList.scrollHeight;
        console.log('kuma');
    });
}

scrollToPre(pre){
  setTimeout(function () {
    var itemList = document.getElementById("chat-autoscroll");
    this.current = itemList.scrollHeight;
    if(parseInt(this.current)-parseInt(pre)>window.screen.height*3/4)
      itemList.scrollTop = parseInt(this.current)-parseInt(pre)-(window.screen.height/2);

        console.log(pre);
        console.log(this.current);
        console.log(itemList.scrollTop);
        console.log(window.screen.height);
        console.log(parseInt(this.current)-parseInt(pre));
    });
}


ToTop(){
  var itemList = document.getElementById("chat-autoscroll");
  let top = itemList.scrollTop;
  console.log(top);
  if(top<=0){
      this.doInfinite();
  }

}

doInfinite() {
this.spinner = 1;
    setTimeout(() => {
      //this.limit+=10;
      this.start+=10;
      
      this.messageService.LoadMessageData(this.limit, this.start, this.selectedId)
          .subscribe(
          (res) => {
              if(res.data != ''){

                var itemList = document.getElementById("chat-autoscroll");
                this.pre = itemList.scrollHeight;
                console.log(this.pre);
            
                for (let x of res.data.reverse()){
                  this.messagedatas.unshift(x);
                }

                //this.messagedatas = res.data;
                this.messageService.LoadMessageData(this.messagedatas.length, 0, this.selectedId)
                .subscribe(
                  (res) => {
                    this.messagedatas = res.data;
                })

                this.start -= (10-res.data.length);
                this.nodata = 1;
                this.scrollToPre(this.pre);
                this.spinner = 0;
                
              }else{
                if(this.nodata == 1){
                  let toast = this.toastCtrl.create({
                  message: '己經沒有資料',
                  duration: 1000
                  });
                  toast.present();
                  this.nodata = 0;
                }
                this.start -= 10;
                this.spinner = 0;

                // this.messageService.LoadMessageData(this.messagedatas.length, 0, this.selectedId)
                // .subscribe(
                //   (res) => {
                //     this.messagedatas = res.data;
                // })
              }
          })
      //infiniteScroll.complete();
    }, 1000);

    console.log(this.start);
  }

  // newMessage(){
  //   this.socket = io.connect(this.socketHost);
  //   this.zone = new NgZone({enableLongStackTrace: false});
  //   this.socket.on("connect", (msg) =>{
  //     this.zone.run(() =>{
            
  //      localforage.getItem('user').then((user) => {
            
  //           this.socket.emit('set-token', user[0].email);
  //           //this.college = 1;
  //            console.log(user[0].email);
  //     })

  //       console.log(msg);
        
  //       //this.content.scrollToBottom();
  //     });
  //   });

  //   this.socket.on('messageread', (msg) => {
  //     this.zone.run(() =>{
  //     //this.messagecount = msg;
  //     this.pushMessage();
  //     console.log("message_new");
  //     });
  //   });
  // }

  // pushMessage(){
  //   this.messageService.LoadMessageData(1, 0, this.selectedId)
  //     .subscribe(
  //       (res) => {
  //         for (let x of res.data){
  //               this.messagedatas.push(x);
  //           }
  //           console.log("message_new");
  //     })

  // }

}
