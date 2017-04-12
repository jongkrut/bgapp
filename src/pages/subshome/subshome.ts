import { Component, ViewChild } from '@angular/core';
import { Auth,User  } from '@ionic/cloud-angular';
import { NavController, NavParams,Events, App, Tabs } from 'ionic-angular';
import { Market } from 'ionic-native';

import { AuthPage } from '../auth/auth';
import { MenuPage } from '../menu/menu';
import { SubsOrderPage } from '../subsorder/subsorder';
import { SubsSaldoPage } from '../subssaldo/subssaldo';
import { SubsProfilePage } from '../subsprofile/subsprofile';
import { ProfilePage } from '../profile/profile';
import { WelcomePage } from '../welcome/welcome';
import { FeedbackPage } from '../feedback/feedback';
import { Http } from '@angular/http';

declare var cordova:any;

@Component({
  templateUrl: 'subshome.html'
})
export class SubsHomePage {
  @ViewChild('myTabs') tabRef: Tabs;
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = MenuPage;
  tab2Root: any = SubsOrderPage;
  tab3Root: any = SubsSaldoPage;
  tab4Root: any = SubsMenuPage;

  tab2Title: string = "Order";

  tabParams: number = 0;

  constructor(public navCtrl: NavController, public navParams : NavParams, public auth:Auth, private user : User) {
    this.tabParams = navParams.get("tabs");
  }

  ionViewDidLoad(){
    let user = this.user.get('subscription',null);
    let userd = this.user.get('customer',null);
    if(user != null){
      this.tab2Title = "Langganan";
    }
    if(userd.trial == "1"){
      this.tab2Title = "Info Trial";
    }
  }

  ionViewDidEnter(){
    this.tabRef.select(this.tabParams);
  }

  ionViewCanEnter() {
    if(!this.auth.isAuthenticated()) {
      this.navCtrl.setRoot(WelcomePage);
    }
  }

}


@Component({
  template: `<ion-header>
              <ion-toolbar>
                <ion-title>BlackGarlic</ion-title>
              </ion-toolbar>
             </ion-header>
             <ion-content>
              <ion-list>
                <ion-list-header>PROFIL</ion-list-header>
                <button menuClose ion-item  *ngFor="let p of pages" (click)="openPage(p)">
                  <ion-icon name="{{p.icon}}" item-left></ion-icon>
                  {{p.title}}
                </button>
              </ion-list>

              <ion-list>
                <ion-list-header>SUPPORT</ion-list-header>
                <button menuClose ion-item (click)="showIntercom()">
                  <ion-icon name="chatbubbles" item-left></ion-icon>
                  Chat dengan Kami
                </button>
                <button menuClose ion-item (click)="openFeedback();">
                  <ion-icon name="mail" item-left></ion-icon>
                  Bugs & Feedback
                </button>
              </ion-list>

              <ion-list>
                <ion-list-header>LAINNYA</ion-list-header>
                <button menuClose ion-item (click)="openStore()">
                  <ion-icon name="appstore" item-left></ion-icon>
                  Rate App
                </button>
                <button menuClose ion-item (click)="logout()">
                  <ion-icon name="exit" item-left></ion-icon>
                  Logout
                </button>
              </ion-list>
             </ion-content>`,
  styles: [`
      ion-list : margin-bottom:25px !important;
    `]
})
export class SubsMenuPage {

  pages: Array<{title: string, component: any, icon: string}>;


  constructor(public navCtrl: NavController, private user : User, private auth: Auth, private events: Events, private app: App) { }

  ionViewDidLoad(){
    let user = this.user.get('subscription',null);
    if(user != null){
      this.pages = [
          { title: 'Akun Saya', component: ProfilePage, icon: "contact" },
          { title: 'Profil Langganan', component: SubsProfilePage, icon: "folder"},
      ];
    } else {
      this.pages = [
          { title: 'Akun Saya', component: ProfilePage, icon: "contact" },
      ];
    }
  }

  openFeedback(){
    this.app.getRootNav().push(FeedbackPage);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.app.getRootNav().push(page.component);
  }

  showIntercom(){
      cordova.plugins.intercom.displayMessenger();
  }

  openStore(){
      Market.open('com.blackgarlic.app');
  }

  logout() {
    this.auth.logout();
    this.events.publish('user:logout', Date());
    this.app.getRootNav().push(WelcomePage);
    cordova.plugins.intercom.reset();
  }
}
