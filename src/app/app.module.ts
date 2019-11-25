import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { AuctionPage } from '../pages/auction/auction';
import { AuctionDetailPage } from '../pages/auction-detail/auction-detail';
import { AuctionService } from '../providers/auction-service';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { RegisterPage } from '../pages/register/register';
import { AuthService } from '../providers/auth-service';
import { CommentPage } from '../pages/comment/comment';
import { CommentService } from '../providers/comment-service';
import { BidPage } from '../pages/bid/bid';

//import { Storage } from '@ionic/storage';
import { AuctionPopoverPage } from '../pages/auction-popover/auction-popover';
import { NotificationPage } from '../pages/notification/notification';
import { NotificationService } from '../providers/notification-service';
import { UserOptionPage } from '../pages/user-option/user-option';
import { UserService } from '../providers/user-service';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { EditPasswordPage } from '../pages/edit-password/edit-password';
import { AuctionContactPage } from '../pages/auction-contact/auction-contact';
import { AuctionCreatePage } from '../pages/auction-create/auction-create';
import { AuctionEditPage } from '../pages/auction-edit/auction-edit';

import { MessagePage } from '../pages/message/message';
import { MessageChatPage } from '../pages/message-chat/message-chat';
import { MessageService } from '../providers/message-service';
import { ImageService } from '../providers/image-service';

import { SplashScreen } from '@ionic-native/splash-screen';

import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    AuctionPage,
    AuctionDetailPage,
    LoginPage,
    ProfilePage,
    RegisterPage,
    CommentPage,
    BidPage,
    AuctionPopoverPage,
    NotificationPage,
    UserOptionPage,
    EditProfilePage,
    EditPasswordPage,
    AuctionContactPage,
    AuctionCreatePage,
    AuctionEditPage,
    MessagePage,
    MessageChatPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      backButtonText: ''
     })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    AuctionPage,
    AuctionDetailPage,
    LoginPage,
    ProfilePage,
    RegisterPage,
    CommentPage,
    BidPage,
    AuctionPopoverPage,
    NotificationPage,
    UserOptionPage,
    EditProfilePage,
    EditPasswordPage,
    AuctionContactPage,
    AuctionCreatePage,
    AuctionEditPage,
    MessagePage,
    MessageChatPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},SplashScreen, AuctionService,AuthService,CommentService,NotificationService,UserService,MessageService,DatePipe,ImageService]
})
export class AppModule {}
