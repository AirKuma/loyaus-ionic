import { Component } from '@angular/core';
import { NavController, ToastController, ModalController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { Headers } from '@angular/http';
import { UserOptionPage } from '../../pages/user-option/user-option';
import { AuctionDetailPage } from '../auction-detail/auction-detail';
import { UserService } from "../../providers/user-service";
import { EditProfilePage } from '../edit-profile/edit-profile';
import { ROOT } from '../../app/config';
declare var $:any;
/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [AuthService, UserService]
})
export class ProfilePage {
  data : any ;
  public getSession: any;
  //keyvalue : any;
  public name : any;
  headers:Headers;

  public my: string;
  public itemdatas = [];
  //private loading: any;
  public start;
  public limit:any=8;
  public userdata:any;
  root:string = ROOT;

  private spinner: any;
  private nodata: any;

  constructor(public navCtrl: NavController, public authservice: AuthService, public toastCtrl: ToastController, private userService : UserService, public modalCtrl: ModalController) {
      // this.data = {};
      // this.data.title = "";
      // this.data.desc = "";
      //this.my = 'myitem';
  }

  ngAfterViewChecked(){
    if(this.itemdatas[0]){
      console.log('ionViewDidLoad AuctionPage');
      $('[data-countdown]').each(function() {
        var $this = $(this),
            finalDate = $(this).data('countdown');

        $this.countdown(finalDate, function(event) {
          $this.html(event.strftime('%D 天 %H 時 %M 分 %S 秒'));
        });
      });
    }
  }

  ionViewDidLoad() {
    this.my = 'myitem';
    this.spinner = 1;
    this.nodata = 1;
  }

  ionViewWillEnter(){
    this.start=0;
    
  //this.keyvalue = this.authservice.checkToken();
  
  // this.keyvalue = localStorage.getItem('usertoken');
  //  console.log(this.keyvalue);
  //     if( this.keyvalue == null){
  //       this.navCtrl.setRoot(LoginPage);
        
  //     }else{
      // this.loading = this.loadingCtrl.create({
      //   content: '載入中...'
      // });
      // this.loading.present();

  
      // this.headers = new Headers({
      //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      // });
      // this.headers.append('Authorization', 'Bearer ' + this.keyvalue)

      this.loadUserDatas();
      if(this.my=='myitem')
        this.loadMyItemDatas();
      else
        this.loadMyBidItemDatas();
    //   }
    
    
    // console.log('Hello Admin Page');
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

  pushOptionPage(){
    this.navCtrl.push(UserOptionPage);
  }

  loadUserDatas(){
    this.userService.loadUserData()
      .subscribe(res => {
          this.userdata = res.data;
          console.log(this.userdata[0].college);
      })
  }

  loadMyItemDatas(){
    this.userService.LoadMyItemData(this.limit, this.start)
      .subscribe(res => {
          this.itemdatas = res.data;
          this.spinner = 0;
      }, err => console.log(err),
      () => {
        // this.loading.dismiss();
        console.info('loading Jsons complete')
      })
  }

  loadMyBidItemDatas(){
    this.userService.LoadMyBidItemData(this.limit, this.start)
      .subscribe(res => {
          this.itemdatas = res.data;
          this.spinner = 0;
      }, err => console.log(err),
      () => {
        //this.loading.dismiss();
        console.info('loading Jsons complete')
      })
  }

  updateMyAuctionData(){
    // this.loading = this.loadingCtrl.create({
    //       content: '載入中...'
    //     });
    // this.loading.present();
    setTimeout(() => {
      this.start=0;
      this.spinner = 1;
      this.nodata = 1;
      if(this.my=='myitem')
        this.loadMyItemDatas();
      else
      this.loadMyBidItemDatas();
     });
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
    this.start+=8;

    if(this.my=='myitem'){
      this.userService.LoadMyItemData(this.limit, this.start)
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
    }else{
      this.userService.LoadMyBidItemData(this.limit, this.start)
          .subscribe(
          (res) => {
              if(res.data != ''){
                for (let x of res.data){
                this.itemdatas.push(x);
                }
                this.start -= (8-res.data.length);
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
    }
    }, 1000);

    console.log(this.start);
  }

  openEditProfilePage(){
    this.navCtrl.push(EditProfilePage);
  }
}
