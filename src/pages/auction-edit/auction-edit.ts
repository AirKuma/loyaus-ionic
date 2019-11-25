import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ActionSheetController, LoadingController, Loading, Platform } from 'ionic-angular';
import { AuctionService } from "../../providers/auction-service";
import { ROOT } from '../../app/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, File, Transfer, FilePath } from 'ionic-native';
//import { ImageService } from "../../providers/image-service";

/*
  Generated class for the AuctionEdit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var cordova: any;

@Component({
  selector: 'page-auction-edit',
  templateUrl: 'auction-edit.html',
  providers : [ AuctionService ]
})
export class AuctionEditPage {
public selectedId:any;
public selectedType:any;
public auctionDetail:any;
root:string = ROOT;
editItemForm: FormGroup;
public categoryatas = [];

lastImage: string = null;
loading: Loading;
public imagedatas:any;

sandbutton:number=1;

  constructor(public navCtrl: NavController, private navParam: NavParams, private auctionService : AuctionService, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, private formBuilder: FormBuilder, public loadingCtrl: LoadingController, public platform: Platform) {
      this.editItemForm = formBuilder.group({
        name: ['', Validators.compose([Validators.maxLength(100), Validators.required])],
        category_id: ['', Validators.required],
        new: [false],
        free: [false],
        target: [0, Validators.required],
        description: ['', Validators.required],
        price: [''],
      }, {validator: this.priceCheck('free', 'price')});
  }
  priceCheck(free: any, price: any) {
    return (group: FormGroup) => {
      let freeInput = group.controls[free];
      let priceInput = group.controls[price];
    
      console.log(freeInput.value);
      console.log(priceInput.value);
      if (freeInput.value == false && (priceInput.value == '' || priceInput.value == null)){
        return priceInput.setErrors({notEquivalent: true});
      }else{
        //return priceInput.setErrors(null);
      }
    }
  }

  ionViewDidLoad() {
     this.selectedId = this.navParam.get('id');
     this.selectedType = this.navParam.get('type');
     console.log("AAAMMMM= "+this.selectedType);
  }

  ionViewWillEnter() {
    this.loadimagedates();
    this.loadCategoryDatas();
    this.loadDetail();
  }

  editItem(id){
  let auctiondata = JSON.stringify(this.editItemForm.value);
  this.sandbutton = 0;
    this.auctionService.putEditItem(auctiondata,id)
        .subscribe(data =>{
          console.log(data);
           this.loadDetail();
           this.navCtrl.pop();
           this.sandbutton = 1;
        }, err=>{
          console.log(err);
          let toast = this.toastCtrl.create({
          message: '更新無效',
          duration: 3000
          });
          toast.present();
          this.sandbutton = 1;
        })
  }

  loadDetail(){
    this.auctionService.LoadDetail(this.selectedId)
        .subscribe(res => {
          this.auctionDetail = res.data;
          console.log(this.auctionDetail);

          let newitem = false;
          if(this.auctionDetail[0].new==1)
            newitem = true;
          let free = false;
          if(this.auctionDetail[0].free==1)
            free = true;

          this.editItemForm = this.formBuilder.group({
          name: [this.auctionDetail[0].name, Validators.compose([Validators.maxLength(100), Validators.required])],
          category_id: [this.auctionDetail[0].category.id, Validators.required],
          new: [newitem],
          free: [free],
          target: [this.auctionDetail[0].target, Validators.required],
          description: [this.auctionDetail[0].description, Validators.required],
          price: [this.auctionDetail[0].price],
        }, {validator: this.priceCheck('free', 'price')});

     })
  }

  loadimagedates(){
    this.auctionService.LoadItemImageData(this.selectedId)
      .subscribe(res => {
          this.imagedatas = res.data;
      })
  }

  loadCategoryDatas(){
    let categoryType = 'seek';
    if(this.selectedType==0)
       categoryType = 'bid'

    console.log(categoryType);
    this.auctionService.LoadItemCategoryData(categoryType)
      .subscribe(res => {
          this.categoryatas = res.data;
          console.log(this.categoryatas);
      }, err => console.log('hey, error when loading names list - ' + err)
    )
  }

  itemImageDestroy(imageid ,publicid,type){
    if(this.imagedatas.length==1 && this.selectedType==0){
        this.presentToast('至少要存在一張圖片');
    }else{
        this.auctionService.destroyItemImage(imageid,publicid,type)
          .subscribe(data =>{
              this.loadimagedates();
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
  } 

  presentActionSheet(imageid,piblicid){
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '刪除圖片',
            role: 'destructive',
            handler: () => {
              this.itemImageDestroy(imageid, piblicid, this.selectedType);
            }
          },
          {
            text: '取消',
            role: 'cancel'
          }
        ]
      });
      actionSheet.present();
  }

  public presentActionimageSheet() {

    if(this.imagedatas.length==3){
      this.presentToast('不能超過三張圖片');
    }else{
      let actionSheet = this.actionSheetCtrl.create({
        title: '選擇圖片來源',
        buttons: [
          {
            text: '從圖片庫上傳',
            handler: () => {
              this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
            }
          },
          {
            text: '拍照上傳',
            handler: () => {
              this.takePicture(Camera.PictureSourceType.CAMERA);
            }
          },
          {
            text: '取消',
            role: 'cancel'
          }
        ]
      });
      actionSheet.present();
    }
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
      
    };
  
    // Get the data of an image
    Camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
        FilePath.resolveNativePath(imagePath)
        .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('選擇圖片發生錯誤');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }
  
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage();
    }, error => {
      this.presentToast('儲存圖片發生錯誤');
    });
  }
  
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  public uploadImage() {
   
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();

    this.auctionService.uploadImage(this.lastImage, this.selectedId)
      .then(data => {
        console.log(data);
        this.loadimagedates();
      this.loading.dismissAll()
      this.presentToast('圖片成功上傳！');
    }, err => {
      this.loading.dismissAll()
      this.presentToast('上傳失敗');
      console.log(err);
      
    });

  }

}
