import { Component, ViewChild } from '@angular/core';
import { Content, NavController, ViewController, NavParams, ToastController } from 'ionic-angular';
import { AuctionService } from "../../providers/auction-service";
//import { Storage } from '@ionic/storage';
import { ROOT } from '../../app/config';
import * as localforage from "localforage";
import { DatePipe } from '@angular/common';

/*
  Generated class for the Bid page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-bid',
  templateUrl: 'bid.html',
  providers : [AuctionService]
})
export class BidPage {
  @ViewChild(Content) contentview: Content;
  public selectedId:any;
  //public biddatas = [];
  biddatas: any;
  price: any;
  public owenrId:any;
  //public local: Storage;
  auth_user:any;
  item_price: number;
  end_time: any;
  public now:any; 

  public start:number=0;
  public limit:number=10;
  root:string = ROOT;
  public priceError:string; 
  type:number;

  private nodata: any;
  sandbutton:number=1;
  private spinner: any;

  constructor(public navCtrl: NavController, private viewCtrl : ViewController, private navParam: NavParams, private auctionService : AuctionService, public toastCtrl: ToastController, private datepipe: DatePipe) {
    // this.price = "";
    // this.selectedId = navParam.get('id');
    // this.owenrId = navParam.get('user_id');
    // this.item_price = navParam.get('price');
    // this.end_time = navParam.get('end_time');
  }

  ionViewDidLoad(){
    localforage.getItem('user').then((user) => {
          this.auth_user = user[0].id;
          console.log(this.auth_user);
    })
    this.price = "";
    this.selectedId = this.navParam.get('id');
    this.owenrId = this.navParam.get('user_id');
    this.item_price = this.navParam.get('price');
    this.end_time = this.navParam.get('end_time');
	  this.type = this.navParam.get('type');
    this.now = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.nodata = 1;
  }

  ionViewWillEnter() {
    // this.owenrId;
    // this.item_price;
    // this.end_time;
    this.spinner = 1;
    this.loadBidData();
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  itemBid(){
    
    if(this.price != ""){
      this.sandbutton = 0;
      this.auctionService.postBid(this.price, this.selectedId)
        .subscribe(data =>{
          console.log(data);
          this.start = 0;
          this.loadBidData();
          //this.item_price = this.price;
          this.price = "";
          this.sandbutton = 1;
          this.contentview.scrollToTop();
        }, err=>{
          this.loadBidData();
          console.log(err);
          let toast = this.toastCtrl.create({
          message: '無效出價',
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

  loadBidData(){
    this.auctionService.LoadItemBidData(this.selectedId, this.limit, this.start)
      .subscribe(res => {
          this.biddatas = res.data;
          this.spinner = 0;
          if(this.biddatas.length!=0)
            this.item_price = this.biddatas[0].price
      })
    console.log(this.biddatas)
  }

   doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.start+=10;
      
      this.auctionService.LoadItemBidData(this.selectedId, this.limit, this.start)
          .subscribe(
          (res) => {
              //console.log(res.data.length);
              if(res.data != ''){
                for (let x of res.data){
                this.biddatas.push(x);
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
  
 priceCheck(){
   if(this.biddatas){
      if(this.type==0){
          if(this.biddatas.length==0 && this.price < this.item_price ){
            this.priceError = "價錢不能小於"+this.item_price;
            return true;
          }
          else if(this.biddatas.length!=0 && this.price <= this.item_price){
            this.priceError = "價錢不能小於或等於"+this.item_price;
            return true;
          }
      }else{
          if(this.biddatas.length==0 && this.price > this.item_price){
            this.priceError = "價錢不能大於"+this.item_price;
            return true;
          }
          else if(this.biddatas.length!=0 && this.price >= this.item_price){
            this.priceError = "價錢不能大於或等於"+this.item_price;
            return true;
          }
      }

    }
 }

 doRefresh(refresher) {
    this.start=0;
      setTimeout(() => {
          this.loadBidData();
          refresher.complete();
      }, 2000);
  }

}
