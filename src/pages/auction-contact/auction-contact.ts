import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { UserService } from "../../providers/user-service";

/*
  Generated class for the AuctionContact page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-auction-contact',
  templateUrl: 'auction-contact.html'
})
export class AuctionContactPage {
  public contactdId:any;
  public contactData:any;

  constructor(public navCtrl: NavController, private navParam: NavParams, private userService : UserService, private viewCtrl : ViewController) {
    //this.contactdId = navParam.get('user_id');
    //this.loadContactData();
  }

  ionViewDidLoad() {
    this.contactdId = this.navParam.get('user_id');
  }

  ionViewWillEnter(){
     this.loadContactData();
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  loadContactData(){
    this.userService.LoadUserContactData(this.contactdId)
      .subscribe(res => {
          this.contactData = res.data;
      })
    console.log(this.contactData)
  }

}
