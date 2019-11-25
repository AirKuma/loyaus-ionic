import { Component, NgZone, ViewChild  } from '@angular/core';
import * as io from 'socket.io-client';
import { NavController, Content } from 'ionic-angular';

import { MessagePage } from '../message/message';

import { AuctionPage } from '../auction/auction';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';
import { NotificationPage } from '../notification/notification';
import { UserService } from "../../providers/user-service";
import * as localforage from "localforage";

@Component({
  templateUrl: 'tabs.html',
  providers: [UserService]
})
export class TabsPage {
  @ViewChild(Content) content: Content;
  messages:any = [];
  socketHost: string = "http://45.55.22.181:3000/";
  socket:any;
  noticount:any;
  messagecount:any;
  username:string;
  zone:any;
  zone1:any;
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = AuctionPage;
  // tab2Root: any = AboutPage;
  tab3Root: any = MessagePage;
  tab4Root: any = NotificationPage;
  tab5Root: any = ProfilePage;

  constructor(private userService : UserService) {
    this.socket = io.connect(this.socketHost);
    this.zone = new NgZone({enableLongStackTrace: false});
    this.socket.on("connect", (msg) =>{
      this.zone.run(() =>{

    localforage.getItem('user').then((user) => {
            
            this.socket.emit('set-token', user[0].email);
            //this.college = 1;
             console.log(user[0].email);
      })

        // this.socket.emit('set-token', localStorage.getItem('email'));
        //this.messages.push(msg);
        console.log(msg);
        
        //this.content.scrollToBottom();
      });
    });
    // this.socket.on('notification', function(message) {

    //   this.noticount = message;
    //   // this.pushNotic(message);
    //   // console.log(message);
    //   console.log(this.noticount);
    // });
    this.socket.on('notification', (msg) => {
      this.zone.run(() =>{
      this.noticount = msg;
      console.log("notification", msg);
      });
    });

    this.socket.on('messageread', (msg) => {
      this.zone.run(() =>{
      this.messagecount = msg;
      console.log("message", msg);
      });
    });

  this.loadUserNotificationCount();
  this.loadUserMessageCount();


  }

  changeToZore(){
    this.noticount = null;
    console.log("AAA");
        this.userService.postReadNotification()
      .subscribe(res => {
          
      })
    
  }

  message(){
    this.messagecount = null;
    console.log("AAA");
        this.userService.postReadMessage()
      .subscribe(res => {
          
      })
    
  }

  loadUserNotificationCount(){
    this.userService.getReadNotification()
      .subscribe(res => {
                  console.log(res);
          this.noticount = res;

      })
  }

  loadUserMessageCount(){
    this.userService.getReadMessage()
      .subscribe(res => {
                  console.log(res);
          this.messagecount = res;

      })
  }
  // pushNotic(message){
  //   console.log(message);
    
  // }
  
}
