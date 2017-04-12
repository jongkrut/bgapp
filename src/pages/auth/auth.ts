import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events, App } from 'ionic-angular';
import { Auth, User, FacebookAuth,GoogleAuth  } from '@ionic/cloud-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as cryptojs from 'crypto-js';

import { SubsHomePage } from '../subshome/subshome';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html'
})
export class AuthPage {

  loginInfo : any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public events : Events, public loadingCtrl : LoadingController, public http : Http, public alertCtrl : AlertController,
                private user : User, public auth : Auth, public facebookAuth: FacebookAuth, public googleAuth : GoogleAuth, public app: App) { }

  loginSubmit() {
      let loader = this.loadingCtrl.create({
          content: "Logging in..."
      });
      loader.present();

      let loginData = { "create" : 0, "email" : this.loginInfo.email, "password" : cryptojs.SHA1(this.loginInfo.password).toString() };
      let loginOptions = { 'inAppBrowserOptions': {'hidden': true} };

      this.auth.login('custom', loginData, loginOptions).then(() => {
          loader.dismiss();

          this.user.details.name = this.user.get('customer',null).first_name + " "  + this.user.get('customer',null).last_name;
          this.user.details.email = this.user.get('customer',null).customer_email;
          this.user.save();

          let userd = this.user.get('customer',null);
          this.events.publish('user:login', userd.trial, userd.subscription_status, 'Basic');
          if(userd.trial == "1" || userd.subscription_status == "1") {
            this.navCtrl.setRoot(SubsHomePage);
          } else {
            this.navCtrl.setRoot(HomePage);
          }

      }, (err) => {
          loader.dismiss();
          console.log("ERR"  + JSON.stringify(err));
          let alert = this.alertCtrl.create({
            title:'Login Error',
            subTitle: 'Invalid User or Password',
            buttons:['OK']
          });
          alert.present();
      });
  }

  loginFB() {
    let loader = this.loadingCtrl.create({
        content: "Logging in..."
    });
    loader.present();

    this.facebookAuth.login().then(() => {
      this.user.details.name = this.user.social.facebook.data.full_name;
      this.user.details.email = this.user.social.facebook.data.email;

      let postData = { "email" : this.user.social.facebook.data.email, "full_name" : this.user.social.facebook.data.full_name };

      this.http.post("http://api.blackgarlic.id:7005/auth", postData).map(res => res.json()).subscribe(data => {
          this.user.set("customer", data.customer);
          if(data.address)
            this.user.set("address", data.address);
          if(data.subscription)
            this.user.set("subscription", data.subscription);
          this.user.save();
          loader.dismiss();

          let userd = this.user.get('customer',null);
          this.events.publish('user:login', userd.trial, userd.subscription_status, 'Facebook');
          if(userd.trial == "1" || userd.subscription_status == "1") {
            this.navCtrl.setRoot(SubsHomePage);
          } else {
            this.navCtrl.setRoot(HomePage);
          }
      });

      }, (err) => {
        loader.dismiss();
        console.log("ERR"  + JSON.stringify(err));
      }
    );
  }

  loginGoogle() {
    let loader = this.loadingCtrl.create({
        content: "Logging in..."
    });
    loader.present();

    this.googleAuth.login().then(() => {
        this.user.details.name = this.user.social.google.data.full_name;
        this.user.details.email = this.user.social.google.data.email;

        let postData = { "email" : this.user.social.google.data.email, "full_name" : this.user.social.google.data.full_name };

        this.http.post("http://api.blackgarlic.id:7005/auth", postData).map(res => res.json()).subscribe(data => {
            loader.dismiss();
            this.user.set("customer", data.customer);
            if(data.address)
              this.user.set("address", data.address);
            if(data.subscription)
              this.user.set("subscription", data.subscription);
            this.user.save();

            let userd = this.user.get('customer',null);
            this.events.publish('user:login', userd.trial, userd.subscription_status, 'Google');
            if(userd.trial == 1 || userd.subscription_status == 1) {
              this.navCtrl.setRoot(SubsHomePage);
            } else {
              this.navCtrl.setRoot(HomePage);
            }
        });
    }, (err) => {
      loader.dismiss();
      console.log(err);
    });
  }
}
