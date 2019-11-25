import { FormControl, FormGroup } from "@angular/forms";

import { AuthService } from '../providers/auth-service';
import { UserService } from '../providers/user-service';


export class UserValidator {


   public static emailValidator(control: FormControl) {
        // RFC 2822 compliant regex
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'emailValidator': true };
        }
    }

    public static collegeEmailValidator(control: FormControl) {
        if (control.value.match(/^[a-z0-9._%+-]+@mail.fju.edu.tw$/)) {
            return null;
        } else {
            return { 'collegeEmailValidator': true };
        }
    }

    public static figureValidator(control: FormControl) {
        if (control.value.match(/^[a-zA-Z0-9\s-]+$/) || control.value=='') {
            return null;
        } else {
            return { 'figureValidator': true };
        }
    }

    public static otherEmailValidator(control: FormControl) {
        // RFC 2822 compliant regex
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/) || control.value=='') {
            return null;
        } else {
            return { 'emailValidator': true };
        }
    }

    public static ifEmailUnique(authService : AuthService) {
    return (control: FormControl) => { 
      if(control.value){
          //console.log(control.value);
        authService.isEmailUnique(control.value)
        .subscribe(res => {
          //console.log(res);
            if (res != 0) {
              //return { 'notUnique': true };
              return control.setErrors({notUnique: true})
            }
        })
      }
    }
  }

   public static checkCurrentPassword(userService : UserService) {
    return (control: FormControl) => { 
      if(control.value.length>=6){
          //console.log(control.value);
        userService.checkCurrentPawword(control.value)
        .subscribe(res => {
          //console.log(res);
            if (res == 0) {
              //return { 'notUnique': true };
              return control.setErrors({currentPassword: true})
            }else{
                return control.setErrors(null);
            }
        })
      }
    }
  }


}