import { Component } from '@angular/core';
import { NavController, ViewController, AlertController, LoadingController, ToastController, Loading } from 'ionic-angular';
//import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { RegisterPage } from '../register/register';

import { TabsPage } from '../tabs/tabs';
import * as localforage from "localforage";

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AuthService]
})
export class LoginPage {
  data: any;
  //public local: Storage;

  auth_type:string = "N/A";
  auth_status:string = "";
  is_auth_error:any = "";
  token:any;
  actived : any;
  user:any;
  loading: Loading;

  constructor(public navCtrl: NavController, private viewCtrl : ViewController, private alert :AlertController, private loadingCtrl : LoadingController, private authService : AuthService, public toastCtrl: ToastController) {
    this.data = {};
    this.data.username = "";
    this.data.password = "";
    //this.local = new Storage();

    // mylocalforage.getItem('token').then(token => {
		// console.log('Token forage start');
		// this.token = token;
		// console.log('Token forage, ' + this.token + '! You have a very nice token.');
    // return token;
    // }).then(() => {

    //       if(this.token!=null){
    //         this.navCtrl.setRoot(TabsPage);
    //       }

    // });
    // this.token = localStorage.getItem('usertoken');
    // console.log(this.token);
    // if(this.token!=null){
    //         this.navCtrl.setRoot(TabsPage);
    // }
  }

  // ionViewDidLoad() {

  // }

  // checkuser() {
  //   this.local.get('user').then((val) => {
  //     this.actived = val.actived;
  //     console.log(this.actived);
  //     if(this.actived == 1){
  //         this.navCtrl.setRoot(TabsPage);
  //     }else{
  //         this.local.remove('token');
  //         this.local.remove('user');
  //         let toast = this.toastCtrl.create({
  //               message: '己經沒有資料',
  //               duration: 1000
  //               });
  //         toast.present();
  //       }
  //   });
  // }

  login(){
    this.loading = this.loadingCtrl.create({
        content: 'Wait a minute...',
      });
      this.loading.present();
    this.auth_type = 'Token';
    var $obs = this.authService.getAuthToken(this.data.username, this.data.password);
    
    $obs.subscribe(
            data => {
                this.loading.dismissAll();
                this.auth_status = 'OK';
                this.is_auth_error = false;
                console.log("82");
                console.log(data);


                // localforage.getItem('user').then((user) => {
                //     this.user = user;
                //     console.log("99 ");
                //     console.log(user);
                //     this.actived = this.user['actived'];
                //     return user; 
                // }).then(() => {
                //   console.log("101"+this.actived);
                //   // this.actived = this.user['actived'];
                //   console.log(this.actived);
                //   if(this.actived == 1){
                //       this.navCtrl.setRoot(TabsPage);
                //   }else{
                //       this.local.remove('token');
                //       localStorage.removeItem('token');
                //       this.local.remove('user');
                //       localforage.removeItem('user');
                //       let toast = this.toastCtrl.create({
                //           message: '請檢察email認證帳號。',
                //           duration: 1000
                //       });
                //       toast.present();
                //    }

                // });

                this.authService.setTokenHeader(data);
                this.authService.setUserInfoStorage()
                  .subscribe(res => {
                     if(res.data[0].actived==1){
                       localforage.setItem('user', res.data)
                       .then(res => {
                          this.navCtrl.setRoot(TabsPage);
                      })
                     }
                     else{
                          localStorage.removeItem('usertoken');
                          let toast = this.toastCtrl.create({
                          message: "請先檢查信箱，帳號認證後，再進行登入！",
                          duration: 3000,
                          showCloseButton: true,
                          closeButtonText: "關閉"
                          });
                          toast.present();
                     }
                      console.info('BAKA!!!!!')

                  }, err => console.log('hey, error when loading names list - ' + err),
                  () => {
                    console.info('loading Jsons complete')}
                  )
                
            },
            err => {
                this.loading.dismissAll();
                this.auth_status = `Error: ${err}`;
                this.is_auth_error = true;
                this.logError(err)

                  let alert = this.alert.create({
                      title: 'Warning',
                      subTitle: '帳號或密碼錯誤!',
                      buttons: ['OK']
                  });
                  alert.present();
            },
            () => console.log('Finish Auth'));

            


  }

  logError(err) {
      console.error('Error: ' + err);
  }

  register(){
    this.navCtrl.push(RegisterPage);
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }

}
