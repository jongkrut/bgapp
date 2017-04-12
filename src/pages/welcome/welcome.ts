import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AuthPage } from '../auth/auth';
import { SignupPage } from '../signup/signup';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  login(){
    this.navCtrl.push(AuthPage);
  }

  register(){
    this.navCtrl.push(SignupPage);
  }
}
