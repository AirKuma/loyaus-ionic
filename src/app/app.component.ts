import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';

import { LoginPage } from '../pages/login/login';

import { AuthService } from '../providers/auth-service';
// import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage : any;

  constructor(platform: Platform, private authService : AuthService) {


    
    // if(this.authService.isLogin())
    //   this.rootPage = TabsPage;
    // else
    //   this.rootPage = LoginPage;
    // platform.ready().then(() => {

    //   // Okay, so the platform is ready and our plugins are available.
    //   // Here you can do any higher level native things you might need.
    //   StatusBar.styleDefault();
    //   // Splashscreen.hide();

    //   if (Splashscreen) {
    //   setTimeout(() => {
    //   Splashscreen.hide();
    //   }, 100);
    //   }

    // });
    if(this.authService.isLogin())
      this.rootPage = TabsPage;
    else
      this.rootPage = LoginPage;
    platform.ready().then(() => {



      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      // Splashscreen.hide();
    if(Splashscreen)
      Splashscreen.hide();


    });


  }
}
