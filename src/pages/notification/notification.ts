import { Component } from '@angular/core';
import { NavController, ToastController, ModalController } from 'ionic-angular';
import { NotificationService } from "../../providers/notification-service";
import { AuctionDetailPage } from '../auction-detail/auction-detail';

/*
  Generated class for the Notification page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
  providers : [ NotificationService ]
})
export class NotificationPage {
  public  notificationdatas:any;
  public start:number;
  public limit:number=10;

  private spinner: any;
  private nodata: any;

  constructor(public navCtrl: NavController, private notificationService : NotificationService, public toastCtrl: ToastController, public modalCtrl: ModalController) {
      this.notificationdatas = [];
  }

  // ionViewDidLoad() {
  //   //this.start = 0;
  // }

  ionViewWillEnter() {
    this.start = 0;
    this.spinner = 1;
    this.nodata = 1;
    this.loadNotificationDatas();
  }

  loadNotificationDatas(){
    this.notificationService.LoadNotificationData(this.limit, this.start)
      .subscribe(res => {
          this.notificationdatas = res.data;
          this.spinner = 0;
      })
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.start+=10;
      
      this.notificationService.LoadNotificationData(this.limit, this.start)
          .subscribe(
          (res) => {
              //console.log(res.data.length);
              if(res.data != ''){
                for (let x of res.data){
                this.notificationdatas.push(x);
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

  passpage(event, item){
      // this.navCtrl.push(AuctionDetailPage, {
      //     id: item
      // })
      let modal = this.modalCtrl.create(AuctionDetailPage, {
          id: item
      });
      modal.onDidDismiss(() => {
        this.notificationService.LoadNotificationData(this.notificationdatas.length, 0)
        .subscribe(res => {
            this.notificationdatas = res.data;
        })
      });
     modal.present();
     //this.loadNotificationDatas();
  }

  doRefresh(refresher) {
    this.start=0;
      setTimeout(() => {
          this.loadNotificationDatas();
          refresher.complete();
      }, 2000);
  }

}
