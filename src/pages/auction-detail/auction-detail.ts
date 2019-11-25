import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController,Slide, ModalController, ToastController, PopoverController, ActionSheetController, AlertController, ViewController } from 'ionic-angular';
import { AuctionService } from "../../providers/auction-service";
import { CommentPage } from '../../pages/comment/comment';
import { BidPage } from '../../pages/bid/bid';
//import { AuctionPopoverPage } from '../../pages/auction-popover/auction-popover';
//import { AuctionPage } from '../../pages/auction/auction';
//import { Storage } from '@ionic/storage';
import { AuctionContactPage } from '../../pages/auction-contact/auction-contact';
import { ROOT } from '../../app/config';
import * as localforage from "localforage";
import { AuctionEditPage } from '../../pages/auction-edit/auction-edit';
import { DatePipe } from '@angular/common';

import { MessageService } from "../../providers/message-service";
import { MessageChatPage } from '../message-chat/message-chat';
import { UserService } from "../../providers/user-service";
import { TabsPage } from '../tabs/tabs';
declare var $:any;
/*
  Generated class for the AuctionDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-auction-detail',
  templateUrl: 'auction-detail.html',
  providers : [ AuctionService ]
})
export class AuctionDetailPage {
  public auctionDetail:any;
  public selectedId:any;
  public commentdatas:any;
  public biddatas:any;
  public imagedatas:any;

  //public local: Storage;
  auth_user:any;
  public now:any; 
  root:string = ROOT;
  public error:any;
  public favoricon:any;
  public isfavor:any;
  sandbutton:number=1;

  constructor(public navCtrl: NavController, private navParam: NavParams, private auctionService : AuctionService, private loadingCtrl: LoadingController, public modalCtrl: ModalController, public toastCtrl: ToastController, public popoverCtrl: PopoverController, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, private datepipe: DatePipe, private messageService : MessageService, private userService : UserService, private viewCtrl : ViewController) {
    // if(navParam.get('id'))
    //   this.selectedId = navParam.get('id');
    localforage.getItem('user').then((user) => {
          this.auth_user = user[0].id;
          console.log("AAAAPPP: "+this.auth_user);
    })
  }
  
  ngAfterViewChecked(){
    if(this.auctionDetail){
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
    this.selectedId = this.navParam.get('id');
  }

  ionViewWillEnter() {
    this.loadDetail();
    this.ifFavor();
    //this.loadbiddates();
    //this.loadcommentdates();
  }



  loadDetail(){
    this.now = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.auctionService.LoadDetail(this.selectedId)
        .subscribe(res => {
          // let loading = this.loadingCtrl.create({
          //   spinner: 'crescent',
          //   content: 'Please wait...',
          //   duration: 100
          // });
          // loading.present();
          this.error = 0;
          this.auctionDetail = res.data;
          console.log(this.auctionDetail);
          
          this.loadimagedates();
          this.loadbiddates();
          this.loadcommentdates();
          //this.itemenad();
     },err=>{
          this.error = 1;
      })
    


  }

  itemenad(){
    if(this.auctionDetail[0].end_time <= this.now && this.auctionDetail[0].disabled==0){
          let messagetext = '';
            if(this.biddatas[0] && this.auth_user == this.auctionDetail[0].user_id){
                    messagetext = '有人得到你的項目，請趕快與買家連絡。';
            }else if(this.biddatas[0] && this.auth_user == this.biddatas[0].id){
                    messagetext = '恭喜得到該項目！請趕快與賣家連絡。';
            }else if(!this.biddatas[0] && this.auth_user == this.auctionDetail[0].user_id && this.auctionDetail[0].repost <= 2){
                messagetext = '您可以選擇重發項目，重新上架該項目。';
            }else{
                messagetext = '項目已經結束！';
            }
            let toast = this.toastCtrl.create({
                message: messagetext,
                duration: 3000,
                showCloseButton: true,
                closeButtonText: "關閉"
                });
                toast.present();
        }
  }

  loadbiddates(){
    this.auctionService.LoadItemBidData(this.selectedId,2,0)
      .subscribe(res => {
          this.biddatas = res.data;
          //this.loadDetail();
          this.itemenad();
      })
  }

  loadcommentdates(){
    this.auctionService.LoadItemCommentData(this.selectedId,2,0)
    .subscribe(res => {
        this.commentdatas = res.data;
    })
  }

  loadimagedates(){
    this.auctionService.LoadItemImageData(this.selectedId)
      .subscribe(res => {
          this.imagedatas = res.data;
      })
  }

  // mySlideOptions = {
  //   initialSlide: 1,
  //   loop: true
  // };

  presentCommentModal(event) {
    let modal = this.modalCtrl.create(CommentPage, {
          id: this.auctionDetail[0].id,
          user_id:this.auctionDetail[0].user_id,
      });
    modal.present();
  }

  presentBidModal(event) {
    let modal = this.modalCtrl.create(BidPage, {
          id: this.auctionDetail[0].id,
          user_id:this.auctionDetail[0].user_id,
          price:this.auctionDetail[0].price,
          end_time:this.auctionDetail[0].end_time,
		  type:this.auctionDetail[0].type
      });
    modal.present();
  }

  presentContacttModal(event) {
    let userId = this.auctionDetail[0].user_id;
    if(this.auth_user == this.auctionDetail[0].user_id){
      userId = this.biddatas[0].id
    }
    let modal = this.modalCtrl.create(AuctionContactPage, {
          user_id:userId,
    });
    modal.present();
  }

  itemFree(){
    this.sandbutton = 0;
      this.auctionService.postFree(this.selectedId)
        .subscribe(data =>{
            this.loadbiddates();
            this.loadDetail();
            this.sandbutton = 1;
        }, err=>{
          console.log(err);
          let toast = this.toastCtrl.create({
          message: '無效',
          duration: 3000
          });
          toast.present();

          this.loadbiddates();
          this.loadDetail();
          this.sandbutton = 1;
        })
      console.log("GGGGGSGSSSSs");
    
  }

  itemRepost(){
      this.auctionService.postRepost(this.selectedId)
        .subscribe(data =>{
          this.loadDetail();
        }, err=>{
          console.log(err);
          let toast = this.toastCtrl.create({
          message: '無效',
          duration: 3000
          });
          toast.present();
        })

  }

  itemReport(report){
      this.auctionService.postReport(report, this.selectedId)
        .subscribe(data =>{
          console.log(data);
        }, err=>{
          console.log(err);
          let toast = this.toastCtrl.create({
          message: '無效舉報',
          duration: 3000,
          position: 'top',
          showCloseButton: true,
          closeButtonText: "關閉"
          });
          toast.present();
        })
  }  

  iteDestroy(){
      this.auctionService.destroyItem(this.selectedId)
        .subscribe(data =>{
          //this.navCtrl.setRoot(AuctionPage);
          this.navCtrl.setRoot(TabsPage);
        }, err=>{
          console.log(err);
          let toast = this.toastCtrl.create({
          message: '刪除無效',
          duration: 3000,
          position: 'top',
          showCloseButton: true,
          closeButtonText: "關閉"
          });
          toast.present();
        })
  } 

 itemEdit(event, id, type){
      this.navCtrl.push(AuctionEditPage, {
          id: id,
          type: type
      })
  }


  presentActionSheet() {
    if(this.auth_user==this.auctionDetail[0].user_id){
        let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '刪除項目',
            role: 'destructive',
            handler: () => {
              this.presentDeleteConfirm();
            }
          },{
            text: '編輯項目',
            handler: () => {
               this.itemEdit(event, this.auctionDetail[0].id, this.auctionDetail[0].type);
            }
          },{
            text: '取消',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }else{
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '傳訊息給賣家',
            handler: () => {
              this.postmessage(this.auctionDetail[0].user_id);
            }
          },
          {
            text: '檢舉',
            role: 'destructive',
            handler: () => {
              this.showPrompt();
            }
          },{
            text: '取消',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }
  }

  postmessage(id){
    this.userService.LoadUserContactData(id)
      .subscribe(seller => {
          this.messageService.getIfThread(id)
            .subscribe(res => {
              //this.contactData = res.data;
              console.log(res);
              if(res==0){
                  this.messageService.postCreateThread(id)
                  .subscribe(res => {
                    console.log(res);
                      this.gotoMessage(id, seller.data[0].firstname, seller.data[0].lastname);
                  })
              }else{
                  this.gotoMessage(id, seller.data[0].firstname, seller.data[0].lastname);
              }
          })
          //console.log(res);
      })
    
  }

  gotoMessage(id, firstname, lastname){
      let modal = this.modalCtrl.create(MessageChatPage, {
          userid: id,
          firstname:firstname,
          lastname:lastname,
      });
     modal.present();
  }

  sendMessage(event) {
    this.userService.LoadUserContactData(this.auctionDetail[0].user_id)
    .subscribe(seller => {
        let userId = seller.data[0].user_id;
        let firstname = seller.data[0].firstname;
        let lastname = seller.data[0].lastname;
        if(this.auth_user == this.auctionDetail[0].user_id){
          userId = this.biddatas[0].id;
          firstname = this.biddatas[0].firstname;
          lastname = this.biddatas[0].lastname;
        }
        else{
          userId = this.auctionDetail[0].user_id;
          firstname = seller.data[0].firstname;
          lastname = seller.data[0].lastname;
        }
        console.log(this.auth_user);
        console.log(userId);
        let modal = this.modalCtrl.create(MessageChatPage, {
            userid:userId,
            firstname:firstname,
            lastname:lastname,
      });
      modal.present();
    })  
  }

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: '舉報',
      inputs: [
        {
          name: 'content',
          placeholder: '原因(可不填寫)',

        },
      ],
      buttons: [
        {
          text: '取消',
          handler: data => {
            
          }
        },
        {
          text: '確定',
          handler: data => {
            this.itemReport(data.content);
          }
        }
      ]
    });
    prompt.present();
  }

  presentDeleteConfirm() {
  let alert = this.alertCtrl.create({
    title: '刪除項目',
    message: '你確定要刪除該項目？',
    buttons: [
      {
        text: '取消',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: '確定',
        handler: () => {
          this.iteDestroy();
        }
      }
    ]
  });
  alert.present();
}

 presentRepostConfirm() {
  let alert = this.alertCtrl.create({
    title: '重發項目',
    message: '至多可以重發三次，你還可以重發'+(3 - this.auctionDetail[0].repost)+'次，確定要重發該項目？',
    buttons: [
      {
        text: '取消',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: '確定',
        handler: () => {
          this.itemRepost();
        }
      }
    ]
  });
  alert.present();
}

postfavor(){
      if(this.isfavor==0){
        this.isfavor = 1;
        this.favoricon = "md-heart";
      }
      else{
        this.isfavor = 0;
        this.favoricon = "md-heart-outline";
      }
      this.auctionService.postfavor(this.selectedId)
        .subscribe(data =>{
            //this.ifFavor();
            this.loadDetail();
        }, err=>{
          let toast = this.toastCtrl.create({
          message: '無效',
          duration: 3000,
          position: 'top',
          showCloseButton: true,
          closeButtonText: "關閉"
          });
          toast.present();
        })
  }

  ifFavor(){
    this.auctionService.getIffavor(this.selectedId)
      .subscribe(res => {
          if(res==0){
            this.isfavor = 0;
            this.favoricon = "md-heart-outline";
          }
          else{
            this.isfavor = 1;
            this.favoricon = "md-heart";
          }
        })
  }

  setFavorClass(){
      if(this.isfavor!=0)
        return "iconcolor";

  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
