import { Component } from '@angular/core';
import { App, Platform, NavParams } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html'
})
export class WalkthroughPage {

  constructor(public app: App, private platform: Platform, public navParams: NavParams, private splashScreen: SplashScreen) {}

  ionViewDidLoad(){
    this.platform.ready().then(()=>{
        this.splashScreen.hide();
    });
  }
  skip() {
    this.app.getRootNav().setRoot(WelcomePage);
  }
}
