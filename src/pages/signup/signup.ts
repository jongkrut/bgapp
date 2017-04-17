import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events, LoadingController, App } from 'ionic-angular';
import { Auth, User,FacebookAuth,GoogleAuth } from '@ionic/cloud-angular';
import * as cryptojs from 'crypto-js';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { HomePage } from '../home/home';
import { SubsHomePage} from '../subshome/subshome';

@Component({
    templateUrl: 'signup.html'
})

export class SignupPage {
    createSuccess = false;
    data: any = null;
    signUpCredentials = { first_name: '', last_name: '', customer_email: '', customer_password: '' };
    url: string = 'http://api.blackgarlic.id:7005/app/signup/';
    subscribeData: any = {};

    constructor(private navCtrl: NavController, public navParams: NavParams, public auth: Auth, public user: User, public loadingCtrl: LoadingController,
                private facebookAuth: FacebookAuth, private googleAuth: GoogleAuth, private app: App,
                private alertCtrl: AlertController, public events: Events, public http: Http) {
    }

    signUp(credentials) {
        let loader = this.loadingCtrl.create({
            content: "Registering ..."
        });
        loader.present();

        let loginData = { "create" : 1, "first_name": this.signUpCredentials.first_name, "last_name": this.signUpCredentials.last_name, "email" : this.signUpCredentials.customer_email, "password" : cryptojs.SHA1(this.signUpCredentials.customer_password).toString() };
        let loginOptions = { 'inAppBrowserOptions': {'hidden': true} };

        this.auth.login('custom', loginData, loginOptions).then(() => {
            loader.dismiss();

            this.user.details.name = this.signUpCredentials.first_name + " " + this.signUpCredentials.last_name;
            this.user.details.email = this.signUpCredentials.customer_email;
            this.user.save();

            let userd = this.user.get('customer',null);
            this.events.publish('user:signup',userd.trial, userd.subscription_status, 'Basic');
            if(userd.trial == 1 || userd.subscription_status == 1) {
              this.navCtrl.setRoot(SubsHomePage);
            } else {
              this.navCtrl.setRoot(HomePage);
            }
        }, (err) => {
            loader.dismiss();
            console.log("ERR"  + JSON.stringify(err));
            let alert = this.alertCtrl.create({
              title:'Sign Up Error',
              subTitle: 'Invalid User or Password',
              buttons:['OK']
            });
            alert.present();
        });
    }

    showPopup(title, text) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                      this.navCtrl.setRoot(HomePage);
                    }
                }
            ]
        });
        alert.present();
    }

    loginFB() {
      let loader = this.loadingCtrl.create({
          content: "Registering ..."
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
            this.events.publish('user:signup', userd.trial, userd.subscription_status, 'Facebook');
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
          content: "Registering..."
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
              this.events.publish('user:signup', userd.trial, userd.subscription_status, 'Google');
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
