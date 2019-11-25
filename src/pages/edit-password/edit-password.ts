import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from "../../providers/user-service";
import { UserValidator } from  '../../validators/user';
//import { ProfilePage } from '../profile/profile';

/*
  Generated class for the EditPassword page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-edit-password',
  templateUrl: 'edit-password.html',
  providers : [UserService]
})
export class EditPasswordPage {
  updatePasswordForm: FormGroup;
  public userdata:any;
  sandbutton:number=1;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, private userService : UserService, public toastCtrl: ToastController) {
      this.updatePasswordForm = formBuilder.group({
      'old_password': ['', [Validators.required, Validators.minLength(6), UserValidator.checkCurrentPassword(this.userService)]],
      'password': ['', [Validators.required, Validators.minLength(6)]],
      'password_confirmation': ['', [Validators.required, Validators.minLength(6)]]
    }, {validator: this.matchingPasswords('password', 'password_confirmation')})
  }

  // ionViewDidLoad() {
  //   console.log('Hello EditPasswordPage Page');
  // }

  matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }
    }
  }

  editPassword(){
  this.sandbutton = 0;
  this.userdata = JSON.stringify(this.updatePasswordForm.value);
  
    this.userService.postEditPassword(this.userdata)
        .subscribe(data =>{
          console.log(data);
          this.navCtrl.pop();
          this.sandbutton = 1;
        }, err=>{
          console.log(err);
          let toast = this.toastCtrl.create({
          message: '更新密碼無效',
          duration: 3000
          });
          toast.present();
          this.sandbutton = 1;
        })
  }

}
