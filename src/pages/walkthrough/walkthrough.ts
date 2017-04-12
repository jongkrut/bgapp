import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';

@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html'
})
export class WalkthroughPage {

  constructor(public app: App, public navCtrl: NavController, public navParams: NavParams) {}

  skip() {
    this.app.getRootNav().setRoot(WelcomePage);
  }
}
