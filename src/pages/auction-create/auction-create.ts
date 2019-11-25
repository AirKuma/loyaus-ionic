import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams, ToastController, Platform, LoadingController, Loading, ActionSheetController, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuctionService } from "../../providers/auction-service";
import { AuctionDetailPage } from '../auction-detail/auction-detail';
import { Camera, File, Transfer, FilePath } from 'ionic-native';
import { ImageService } from "../../providers/image-service";
import { AuctionPage } from '../auction/auction';
/*
  Generated class for the AuctionCreate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var cordova: any;

@Component({
  selector: 'page-auction-create',
  templateUrl: 'auction-create.html',
  providers : [ AuctionService ]
})
export class AuctionCreatePage {
  @ViewChild(Content) contentview: Content;
  @ViewChild('signupSlider') signupSlider: any;
  itemForm: FormGroup;
  public type:string;
  itemdata : any;
  public categoryatas = [];

  lastImage: string = null;
  loading: Loading;
  public imagfes = [];
  public itemimagfes = [];

  constructor(public navCtrl: NavController, private navParam: NavParams, private auctionservice : AuctionService, private formBuilder: FormBuilder, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public platform: Platform, public loadingCtrl: LoadingController, private imageservice : ImageService, public modalCtrl: ModalController) {
      // this.type = navParam.get('type');
      // this.itemdata = {};

      this.itemForm = formBuilder.group({
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
    
      if (freeInput.value == false && (priceInput.value == '' || priceInput.value == null)){
        return priceInput.setErrors({notEquivalent: true});
      }else{
        return priceInput.setErrors(null);
      }
    }
  }

  ionViewDidLoad() {
    this.type = this.navParam.get('type');
    this.itemdata = {};
    console.log(this.type);
    if(localStorage.getItem('itemimages'))
      this.imagfes = JSON.parse(localStorage.getItem('itemimages'));
  }

  ionViewWillEnter(){
    this.loadCategoryDatas();
    this.loadimage();
  }

  next(){
      this.signupSlider.slideNext();
      this.contentview.scrollToTop();
  }
 
  prev(){
      //console.log(this.signupSlider.getActiveIndex());
      if(this.signupSlider.getActiveIndex()==0)
        this.navCtrl.pop();
      else
        this.signupSlider.slidePrev();
  }

  loadCategoryDatas(){
    this.auctionservice.LoadItemCategoryData(this.type)
      .subscribe(res => {
          this.categoryatas = res.data;
          console.log(this.categoryatas);
      }, err => console.log('hey, error when loading names list - ' + err)
    )
  }

  createItem(){
    // if(!this.steponeForm.valid){
    //     this.signupSlider.slideTo(0);
    // } 
    // else if(!this.steptwoForm.valid){
    //     this.signupSlider.slideTo(1);
    // }
    if(this.type=='bid' && this.imagfes.length==0){
      this.signupSlider.slideTo(0);
      let toast = this.toastCtrl.create({
          message: '拍賣至少要上傳一張圖片！',
          duration: 3000
          });
          toast.present();
   }else{
     this.loading = this.loadingCtrl.create({
        content: 'Wait a minute...',
      });
      this.loading.present();

      this.itemdata = this.itemForm.value;
      console.log(this.imagfes.length);
      console.log(this.type);
      
      if(localStorage.getItem('itemimages'))
          this.itemdata.image = JSON.parse(localStorage.getItem('itemimages'));

      console.log(this.itemdata);
      //let image1111 = JSON.parse(localStorage.getItem('itemimages'));
      //image1111.push( this.itemdata );
      //console.log(image1111);
        this.auctionservice.postItem(this.itemdata,this.type)
            .subscribe(data =>{
              console.log(data);
              localStorage.removeItem('itemimages');
              this.loading.dismissAll();
              this.navCtrl.setRoot(AuctionPage);
              let modal = this.modalCtrl.create(AuctionDetailPage, {
                  id: data.item.id
              });
              modal.present();
            //   this.navCtrl.setRoot(AuctionDetailPage, {
            //     id: data.item.id
            // });
            }, err=>{
              this.loading.dismissAll();
              console.log(err);
              let toast = this.toastCtrl.create({
              message: '新增無效',
              duration: 3000
              });
              toast.present();
            })
      console.log(this.itemForm.value);
   }
  }

  public presentActionSheet() {
    if(this.imagfes.length>=3){
        this.presentToast('圖片不能上傳超過三張！');
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
      duration: 3000
    });
    toast.present();
  }
  
  // // Always get the accurate path to your apps folder
  // public pathForImage(img) {
  //   if (img === null) {
  //     return '';
  //   } else {
  //     return cordova.file.dataDirectory + img;
  //   }
  // }

  // public uploadImage() {
  //   // Destination URL
  //   var url = "http://api.loyaus.com/api/testupload";
  
  //   // File for Upload
  //   var targetPath = this.pathForImage(this.lastImage);
  
  //   // File name only
  //   var filename = this.lastImage;
  
  //   var options = {
  //     fileKey: "file",
  //     fileName: filename,
  //     chunkedMode: false,
  //     mimeType: "multipart/form-data",
  //     params : {'fileName': filename},
  //     //headers: {"Content-Type": "application/json"}
      
  //   };
  
  //   const fileTransfer = new Transfer();
  
  //   this.loading = this.loadingCtrl.create({
  //     content: 'Uploading...',
  //   });
  //   this.loading.present();
  
  //   // Use the FileTransfer to upload the image
  //   fileTransfer.upload(targetPath, url, options).then(data => {
  //     this.loading.dismissAll()
  //     this.presentToast('Image succesful uploaded.');
  //   }, err => {
  //     this.loading.dismissAll()
  //     this.presentToast('Error while uploading file.');
  //     console.log(err);
      
  //   });
  // }

  public uploadImage() {
   
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();

    this.imageservice.uploadItemImage(this.lastImage)
      .then(data => {
        console.log(data);
         //console.log(data['response']);
         //var json = JSON.stringify(eval("(" + data['response'] + ")"));
         let imagedata = JSON.parse(data['response']);
         //console.log(json['public_id']);
         this.setlocal(imagedata['id'],imagedata['url'],imagedata['surl']);

      this.loading.dismissAll()
      this.presentToast('圖片成功上傳！');
    }, err => {
      this.loading.dismissAll()
      this.presentToast('上傳失敗');
      console.log(err);
      
    });

  }

  public deteteuploadImage(id) {

    this.imageservice.destroyImage(id)
      .subscribe(data => {
        console.log(data);
        this.removetlocal(id);
      this.presentToast('圖片成功刪除！');
    }, err => {
      this.presentToast('刪除失敗');
      console.log(err);
      
    });

  }

  private setlocal(id,url,surl){
    var myObjt = {
      'id': id,
      'url': url,
      'surl': surl
    };

    this.imagfes.push( myObjt );
    //console.log(this.imagfes);
    localStorage.setItem('itemimages', JSON.stringify(this.imagfes));
    this.loadimage();
  }

    private removetlocal(id){
        this.imagfes = this.imagfes.filter(function(img) { 
      return img.id !== id;  
    });
    console.log(this.imagfes);
    if(this.imagfes.length==0)
      localStorage.removeItem('itemimages');
    else
      localStorage.setItem('itemimages', JSON.stringify(this.imagfes));
    this.loadimage();
  }

  loadimage(){
    this.itemimagfes = JSON.parse(localStorage.getItem('itemimages'));
    
    console.log(this.itemimagfes);
  }

  presentimageActionSheet(imageid){
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '刪除圖片',
            role: 'destructive',
            handler: () => {
              this.deteteuploadImage(imageid);
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
  
  // delete(){
  //   localStorage.removeItem('itemimages');
  // }

}
