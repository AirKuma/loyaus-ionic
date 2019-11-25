import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, Loading } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserValidator } from  '../../validators/user';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';

/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [AuthService]
})
export class RegisterPage {
  registerForm: FormGroup;
  public submitted: boolean; 
  public events: any[] = [];
  userdata : any;
  private myData: any;
  public majordatas = [];
  loading: Loading;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, private authService : AuthService, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.userdata = {};
    this.registerForm = formBuilder.group({
      'lastname': ['', [Validators.required, Validators.maxLength(10)]],
      'firstname': ['', [Validators.required, Validators.maxLength(10)]],
      'email': ['', [Validators.required, UserValidator.emailValidator, UserValidator.ifEmailUnique(this.authService), UserValidator.collegeEmailValidator, Validators.maxLength(255)]],
      'password': ['', [Validators.required, Validators.minLength(6)]],
      'password_confirmation': ['', [Validators.required, Validators.minLength(6)]],
      'birthday': ['', Validators.required],
      'major_id': ['', Validators.required],
      'gender': ['', Validators.required],
    }, {validator: this.matchingPasswords('password', 'password_confirmation')})
  }

  ionViewWillEnter() {
    this.authService.LoadMajorData()
      .subscribe(res => {
          this.majordatas = res.data;
      })
  }

  matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
    
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }
    }
  }

  register(){
    this.loading = this.loadingCtrl.create({
        content: 'Wait a minute...',
      });
      this.loading.present();
  this.userdata = this.registerForm.value;
    this.authService.postRegister(this.userdata)
        .subscribe(data =>{
          console.log(data);
          this.loading.dismissAll();
          this.navCtrl.setRoot(LoginPage);
          let toast = this.toastCtrl.create({
          message: '註冊成功！請先檢查信箱，帳號認證後，再進行登入',
          duration: 3000
          });
          toast.present();
        }, err=>{
          console.log(err);
          this.loading.dismissAll();
          let toast = this.toastCtrl.create({
          message: '註冊資料有誤',
          duration: 3000
          });
          toast.present();
        })
  }

}
