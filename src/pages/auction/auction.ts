import { Component } from '@angular/core';
import { NavController, Nav, AlertController, ToastController, PopoverController, NavParams, ModalController } from 'ionic-angular';
import { NgSwitch , NgSwitchDefault, NgSwitchCase} from '@angular/common';
import { AuctionService } from "../../providers/auction-service";
import { AuctionDetailPage } from '../auction-detail/auction-detail';
import { AuctionCreatePage } from '../auction-create/auction-create';
import { ROOT } from '../../app/config';
import { AuctionPopoverPage } from '../auction-popover/auction-popover';
import * as localforage from "localforage";
declare var $:any;
/*
  Generated class for the Auction page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-auction',
  templateUrl: 'auction.html',
  providers : [ AuctionService ]
})
export class AuctionPage {
  public itemdatas:any;
  public start;
  public limit:any=8;
  public type: string;
  public categoryatas = [];
  public college:number;
  public category: string;
  //////private loading: any;
  root:string = ROOT;

  private spinner: any;
  private nodata: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alert: AlertController, private auctionservice : AuctionService, public toastCtrl: ToastController, public popoverCtrl: PopoverController, public modalCtrl: ModalController) {
      this.itemdatas = [];       
      this.type = 'bid';
      this.category = '';
      this.spinner = 1;
      this.nodata = 1;
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad AuctionPage');
  // }
  ngAfterViewChecked(){
    if(this.itemdatas[0]){
        //console.log('ionViewDidLoad AuctionPage');
      $('[data-countdown]').each(function() {
        var $this = $(this),
            finalDate = $(this).data('countdown');

        $this.countdown(finalDate, function(event) {
          $this.html(event.strftime('%D 天 %H 時 %M 分 %S 秒'));
        });
      });

    }
    
  }
  
  ionViewWillEnter() {
    this.start=0;
    // this.loading = this.loadingCtrl.create({
    //   content: 'Loading...'
    // });
    // this.loading.present();
    localforage.getItem('user').then((user) => {
            this.college = user[0].college_id;
            //this.college = 1;
            this.loadItemDatas();
            //console.log(this.college);
      })
  }

  doInfinite(infiniteScroll) {

    setTimeout(() => {
      this.start+=8;

      this.auctionservice.LoadItemData(this.type, this.college, this.category , this.limit, this.start, '')
          .subscribe(
          (res) => {
              if(res.data != ''){
                for (let x of res.data){
                this.itemdatas.push(x);
                }
                this.start -= (8-res.data.length);
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
                this.start -= 8;
              }
          })
      infiniteScroll.complete();
    }, 1000);

    //console.log(this.start);
  }

  doRefresh(refresher) {
    this.start=0;
      setTimeout(() => {
          this.loadItemDatas();
          refresher.complete();
      }, 2000);
  }



  passID(event, item){
      // this.navCtrl.push(AuctionDetailPage, {
      //     id: item
      // })
      let modal = this.modalCtrl.create(AuctionDetailPage, {
          id: item
      });
     modal.present();
  }

  createItem(event){
      this.navCtrl.push(AuctionCreatePage, {
          type: this.type
      })
  }

  updateAuctionData(){
    // this.loading = this.loadingCtrl.create({
    //   content: 'Loading...'
    // });
    // this.loading.present();
    setTimeout(() => {
      this.category = '';
      this.start=0;
      this.spinner = 1;
      this.nodata = 1;
      this.loadItemDatas();
    });
  }
  changeTab(tabType){
      //console.log(tabType);
  }

  loadItemDatas(){
    this.auctionservice.LoadItemData(this.type, this.college, this.category , this.limit, this.start, '')
      .subscribe(res => {
          this.itemdatas = res.data;
          this.spinner = 0;
      }, err => console.log('hey, error when loading names list - ' + err),
      () => {
        console.info('loading Jsons complete')}
      )
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(AuctionPopoverPage,{
      type:this.type,
      category:this.category

    });
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(data => {
        // this.loading = this.loadingCtrl.create({
        //   content: 'Loading...'
        // });
        if(data != null){
          this.category = data;
          this.start=0;
          this.spinner = 1;
          this.nodata = 1;
          this.loadItemDatas();
        }
    });
  }
}
