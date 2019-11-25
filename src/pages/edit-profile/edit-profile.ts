import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from "../../providers/user-service";
import { UserValidator } from  '../../validators/user';
//import { ProfilePage } from '../profile/profile';

/*
  Generated class for the EditProfile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
  providers: [AuthService, UserService]
})
export class EditProfilePage {
   public majordatas = [];
   editProfileForm: FormGroup;
   public userdata:any;
   public college:string;
   sandbutton:number=1;

  constructor(public navCtrl: NavController, private authService : AuthService, private formBuilder: FormBuilder, private userService : UserService, public toastCtrl: ToastController) {
      // this.loadUserDatas();
      // this.loadMajorDatas();
      // console.log(this.userdata);
      this.editProfileForm = formBuilder.group({
      'lastname': ['', [Validators.required, Validators.maxLength(10)]],
      'firstname': ['', [Validators.required, Validators.maxLength(10)]],
      'birthday': ['', Validators.required],
      'major_id': ['', Validators.required],
      'username': ['', [Validators.maxLength(20), UserValidator.figureValidator]],
      'phone': [''],
      'line_username': [''],
      'telegram_username': [''],
      'other_email': ['', UserValidator.otherEmailValidator],
    })
  }

  // ionViewDidLoad() {
  //   console.log('Hello EditProfilePage Page');
  // }

  ionViewDidEnter() {
      this.loadMajorDatas();
      this.loadUserDatas();
    } 


  loadMajorDatas(){
    this.authService.LoadMajorData()
      .subscribe(res => {
          this.majordatas = res.data;
      })
  }

  loadUserDatas(){
    this.userService.loadUserData()
      .subscribe(res => {
          this.userdata = res.data;
          this.college = this.userdata[0].college.data[0].name;
           console.log("User Dara");
          console.log(this.userdata[0]);
          if(this.userdata[0].other_email==null)
            this.userdata[0].other_email= '';
          this.editProfileForm = this.formBuilder.group({
            'lastname': [this.userdata[0].lastname, [Validators.required, Validators.maxLength(10)]],
            'firstname': [this.userdata[0].firstname, [Validators.required, Validators.maxLength(10)]],
            'birthday': [this.userdata[0].birthday, Validators.required],
            'major_id': [this.userdata[0].major_id, Validators.required],
            'username': [this.userdata[0].username, [Validators.maxLength(20), UserValidator.figureValidator]],
            'phone': [this.userdata[0].phone],
            'line_username': [this.userdata[0].line_username],
            'telegram_username': [this.userdata[0].telegram_username],
            'other_email': [this.userdata[0].other_email, UserValidator.otherEmailValidator],
        }, {validator: this.ifUsernameUnique('username')})
      })
      console.log(this.userdata);
  }

  ifUsernameUnique(usernameKey: string) {
    return (group: FormGroup) => {
      let usernameInput = group.controls[usernameKey];
      
      if (usernameInput.value && this.userdata[0].username=='') {
          this.userService.isUsernameUnique(usernameInput.value)
          .subscribe(res => {
            console.log(res);
              if (res != 0) {
                //return { 'notUnique': true };
                return usernameInput.setErrors({notUnique: true})
              }
          })
      }
    }
  }

  editProfile(){
 // this.userdata = this.editProfileForm.value;
  this.userdata = JSON.stringify(this.editProfileForm.value);
  this.sandbutton = 0;
    this.userService.postEditProfile(this.userdata)
        .subscribe(data =>{
          console.log(data);
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

}
