import { Component } from '@angular/core';
import { App, Platform, NavController, NavParams } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html'
})
export class WalkthroughPage {

  constructor(private platform: Platform, public splashScreen: SplashScreen, public app: App, public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad(){
    this.platform.ready().then(() => {
    this.splashScreen.hide();
   });
  }
  skip() {
    this.app.getRootNav().setRoot(WelcomePage);
  }
}
