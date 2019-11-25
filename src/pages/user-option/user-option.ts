import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
//import { Storage } from '@ionic/storage';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { EditPasswordPage } from '../edit-password/edit-password';
import { LoginPage } from '../login/login';
import * as localforage from "localforage";

/*
  Generated class for the UserOption page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-option',
  templateUrl: 'user-option.html'
})
export class UserOptionPage {
  //public local: Storage;

  constructor(public navCtrl: NavController, private _app:App) {
     //this.local = new Storage();
  }

  // ionViewDidLoad() {
  //   console.log('Hello UserOptionPage Page');
  // }

  logout(){
    //this.local.remove('token');
    localStorage.removeItem('usertoken');
    //localStorage.removeItem('token2');
    //this.local.remove('user');
    localforage.removeItem('user');
    
    // this.navCtrl.setRoot(LoginPage);
    this._app.getRootNav().setRoot(LoginPage);
    //this.navCtrl.rootNav.setRoot(Log);

  }

  openEditProfilePage(){
    this.navCtrl.push(EditProfilePage);
  }

  openEditPasswordPage(){
    this.navCtrl.push(EditPasswordPage);
  }

}
