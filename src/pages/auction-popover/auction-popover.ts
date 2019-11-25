import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { AuctionPage } from '../auction/auction';
import { AuctionService } from "../../providers/auction-service";

/*
  Generated class for the AuctionPopover page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-auction-popover',
  templateUrl: 'auction-popover.html',
  providers : [AuctionService]
})
export class AuctionPopoverPage {
  public type:any;
  public categoryatas = [];
  public selected:any;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private navParam: NavParams, private auctionservice : AuctionService) {
    //  this.type = navParam.get('type'); 
    //  this.loadCategoryDatas();
    //  this.selected = navParam.get('category');
  }

  ionViewDidLoad() {
      this.type = this.navParam.get('type'); 
      this.selected = this.navParam.get('category');
  }

  ionViewWillEnter(){
      this.loadCategoryDatas();
  }

  close(sel) {
    console.log("S" + this.selected);
    console.log("Sel" + sel);
    this.viewCtrl.dismiss(sel);
  }

  loadCategoryDatas(){
    this.auctionservice.LoadItemCategoryData(this.type)
      .subscribe(res => {
          this.categoryatas = res.data;
          console.log(this.categoryatas);
      }, err => console.log('hey, error when loading names list - ' + err)
    )
  }

  loadItemDatas(){
    this.navCtrl.setRoot(AuctionPage, {
            category: 1
    });
  }

  loadItemDatas2(){
    this.navCtrl.setRoot(AuctionPage, {
            category: 2
        });
  }

}
