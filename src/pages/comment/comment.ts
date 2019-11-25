import { Component, ViewChild } from '@angular/core';
import { Content, NavController, ViewController, NavParams, ToastController, ActionSheetController, AlertController } from 'ionic-angular';
import { AuctionService } from "../../providers/auction-service";
import { CommentService } from "../../providers/comment-service";
//import { Storage } from '@ionic/storage';
import { ROOT } from '../../app/config';
import * as localforage from "localforage";
/*
  Generated class for the Comment page.
  Test
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
  providers : [AuctionService,CommentService]
})
export class CommentPage {
  @ViewChild(Content) contentview: Content;
  public selectedId:any;
  public commentdatas = [];
  content: any;

  //public local: Storage;
  auth_user:any;
  public owenrId:any;

  public start:number=0;
  public limit:number=10;
  root:string = ROOT;

  private nodata: any;
  sandbutton:number=1;
  private spinner: any;

  constructor(public navCtrl: NavController, private viewCtrl : ViewController, private navParam: NavParams, private auctionService : AuctionService, private commentService : CommentService, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController) {
    // this.content = "";
    // this.selectedId = navParam.get('id');
    // this.owenrId = navParam.get('user_id');
  }
  ionViewDidLoad(){
      localforage.getItem('user').then((user) => {
          this.auth_user = user[0].id;
          console.log(this.auth_user);
      })
      this.content = "";
      this.selectedId = this.navParam.get('id');
      this.owenrId = this.navParam.get('user_id');
      this.nodata = 1;
  }
  ionViewWillEnter() {
    //this.owenrId;
    this.spinner = 1;
    this.loadCommentData();
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }

  itemComment(){
    
    if(this.content != ""){
      // console.log(this.content);
      this.sandbutton = 0;
      this.commentService.postComment(this.content, this.selectedId)
        .subscribe(data =>{
          console.log(data);
          this.start = 0;
          this.loadCommentData();
          this.content = "";
          this.sandbutton = 1;
          this.contentview.scrollToTop();
        }, err=>{
          console.log(err);
          let toast = this.toastCtrl.create({
          message: '無效留言',
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

  loadCommentData(){
    this.auctionService.LoadItemCommentData(this.selectedId, this.limit, this.start)
      .subscribe(res => {
          this.commentdatas = res.data;
          this.spinner = 0;
      })
    console.log(this.commentdatas)
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.start+=10;
      
      this.auctionService.LoadItemCommentData(this.selectedId, this.limit, this.start)
          .subscribe(
          (res) => {
              //console.log(res.data.length);
              if(res.data != ''){
                for (let x of res.data){
                this.commentdatas.push(x);
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

   presentActionSheet(user_id,comment) {
    if(this.auth_user==user_id){
      console.log(this.auth_user);
      console.log(user_id);
        let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '刪除留言',
            role: 'destructive',
            handler: () => {
              this.presentDeleteConfirm(comment);
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
            text: '檢舉',
            role: 'destructive',
            handler: () => {
              this.showPrompt(comment);
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

  showPrompt(comment) {
    let prompt = this.alertCtrl.create({
      title: '舉報',
      inputs: [
        {
          name: 'content',
          placeholder: '原因(可不填寫)',
          type: 'textarea'

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
            this.commentReport(data.content,comment.id);
          }
        }
      ]
    });
    prompt.present();
  }

  commentReport(report,id){
      this.commentService.postReport(report, id)
        .subscribe(data =>{
          this.start = 0;
          //this.loadCommentData();
          this.auctionService.LoadItemCommentData(this.selectedId, this.commentdatas.length, 0)
          .subscribe(res => {
              this.commentdatas = res.data;
          })
          console.log(data);
        }, err=>{
          console.log("AAAAAAA"+err);
          var toast1 = this.toastCtrl.create({
          message: '無效舉報',
          duration: 3000,
          position: 'top',
          showCloseButton: true,
          closeButtonText: "關閉"
          });

          toast1.present();
        })
  }

  presentDeleteConfirm(comment) {
  let alert = this.alertCtrl.create({
    title: '刪除留言',
    message: '你確定要刪除該留言？',
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
          this.commentDestroy(comment);
        }
      }
    ]
  });
  alert.present();
}

commentDestroy(comment){
      this.commentService.destroyComment(comment.id)
        .subscribe(data =>{
          //this.start = 0;
          //this.loadCommentData();
          this.commentdatas.splice(this.commentdatas.indexOf(comment), 1);
          // this.auctionService.LoadItemCommentData(this.selectedId, this.commentdatas.length, 0)
          // .subscribe(res => {
          //     this.commentdatas = res.data;
          // })
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

  doRefresh(refresher) {
    this.start=0;
      setTimeout(() => {
          this.loadCommentData();
          refresher.complete();
      }, 2000);
  }

}
