import { Component } from '@angular/core';
import { NavController, ModalController, ToastController } from 'ionic-angular';
import { ROOT } from '../../app/config';
import { MessageChatPage } from '../message-chat/message-chat';
import { MessageService } from "../../providers/message-service";
import * as localforage from "localforage";

/*
  Generated class for the Message page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
  providers : [ MessageService ]
})
export class MessagePage {
  root:string = ROOT;
  public start:number;
  public limit:number=10;
  public  threaddatas:any;
  auth_user:any;

  private spinner: any;
  private nodata: any;

  constructor(public navCtrl: NavController, private messageService : MessageService, public modalCtrl: ModalController, public toastCtrl: ToastController) {
    this.threaddatas = [];
  }

  // ionViewDidLoad() {
  //   console.log('Hello MessagePage Page');
  // }
  ionViewWillEnter() {
    localforage.getItem('user').then((user) => {
          this.auth_user = user[0].id;
    })
    this.start = 0;
    this.spinner = 1;
    this.nodata = 1;
    this.loadThreadDatas();
  }

  loadThreadDatas(){
    this.messageService.LoadThreadsData(this.limit, this.start)
      .subscribe(res => {
          this.threaddatas = res.data;
          this.spinner = 0;
          console.log(this.threaddatas);
          //console.log(this.threaddatas[0]['messages']['data'][0]);
      })
  }

  passID(event ,id, firstname, lastname, thread_id){
      // this.navCtrl.push(MessageChatPage, {
      //     id: messager
      // })
      let modal = this.modalCtrl.create(MessageChatPage, {
          userid: id,
          firstname:firstname,
          lastname:lastname,
      });
      modal.onDidDismiss(() => {
        //this.spinner = 1;
        this.messageService.LoadThreadsData(this.threaddatas.length, 0)
        .subscribe(res => {
            this.threaddatas = res.data;
            console.log(this.threaddatas);
          })
      });
     modal.present();
     //this.postThreadRead(thread_id);
  }

  // postThreadRead(id){
  //   this.messageService.postThreadRead(id)
  //     .subscribe(data =>{
  //       console.log(data);
  //       this.loadThreadDatas();
  //     })
  // }

  is_read(read){
      if(read!=0)
        return "rgb(247, 247, 247)";
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.start+=10;
      
      this.messageService.LoadThreadsData(this.limit, this.start)
          .subscribe(
          (res) => {
              //console.log(res.data.length);
              if(res.data != ''){
                for (let x of res.data){
                this.threaddatas.push(x);
                //console.log(this.itemdatas);
                }
                this.start -= (10-res.data.length);
                this.nodata = 1;
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
              }
          })
      infiniteScroll.complete();
    }, 1000);

    console.log(this.start);
  }

  doRefresh(refresher) {
    this.start=0;
      setTimeout(() => {
          this.loadThreadDatas();
          refresher.complete();
      }, 2000);
  }

}
