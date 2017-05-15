import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, RegistrationEventResponse, NotificationEventResponse } from '@ionic-native/push';
import { Mixpanel, MixpanelPeople } from '@ionic-native/mixpanel';

import { Auth, User } from '@ionic/cloud-angular';
import { Http } from '@angular/http';

import { WelcomePage } from '../pages/welcome/welcome';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { SubsHomePage } from '../pages/subshome/subshome';
import { HomePage } from '../pages/home/home';
import * as moment from 'moment';
import 'moment/locale/id';
import 'intl';
import 'intl/locale-data/jsonp/en';

declare var cordova: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  loggedIn: boolean = false;
  rootPage: any = WalkthroughPage;

  constructor(private platform: Platform, private push: Push, private auth: Auth, private user: User, private http: Http,
              private alertCtrl: AlertController, private loadingCtrl: LoadingController, private events: Events,
              statusBar: StatusBar, splashScreen: SplashScreen, private mixpanel: Mixpanel, private mixpanelPeople: MixpanelPeople) {

    let loading = this.loadingCtrl.create({
      content: 'Initializing...'
    });
    loading.present();

    platform.ready().then(() => {
      statusBar.styleDefault();

      if (this.auth.isAuthenticated()) {
        this.loggedIn = true;
        let userz = user.get("subscription", null);
        let userd = user.get("customer", null);

        this.http.get('http://api.blackgarlic.id:7005/app/user/' + userd.customer_id).map(res => res.json()).subscribe(data => {
          this.user.set("customer", data[0]);
          this.user.save();
          let userd = user.get("customer", null);
          console.log('user', userd)

          cordova.plugins.intercom.registerIdentifiedUser({ email: user.get('customer', null).customer_email });
          cordova.plugins.intercom.hideMessenger();

          this.mixpanel.init("e3f475813524ce395975a3b628b15773").then((data) => {
            let subs_id = 0;
            let subs_added;
            let subs_status = 0;

            if (userz != null) {
              subs_id = userz.subscription_id;
              subs_added = moment().local(userz.added);
              subs_status = userd.subscription_status;
            }
            this.mixpanelPeople.identify(userd.customer_id);
            this.mixpanelPeople.set({
              "$userId": userd.customer_id,
              "$name": userd.first_name + ' ' + userd.last_name,
              "$first_name": userd.first_name,
              "$last_name": userd.last_name,
              "$email": userd.customer_email,
              "$subscriptionId": subs_id,
              "$trial": userd.trial,
              "$signup_date": moment().local(userd.added),
              "$subscription_date": subs_added,
              "$subscription_status" : subs_status,
              "$referral_code": userd.customer_code
            });
          });

          let loginProperties = {
            Email: userd.customer_email,
            Name: userd.first_name + ' ' + userd.last_name,
            'Tipe Login': 'SavedLogin'
          }
          this.mixpanel.track('LoginApp', loginProperties);

          if (userz != null) {
            this.registerPush(userz.subscription_id);
          }

          if (userd.trial == "1" || userd.subscription_status == "1") {
            this.rootPage = SubsHomePage;
          } else {
            this.rootPage = HomePage;
          }
        });
      }
      loading.dismiss();
    });

    events.subscribe('user:login', (trial, subs_status, tipe_login) => {
      this.loggedIn = true;
      cordova.plugins.intercom.registerIdentifiedUser({ email: user.get('customer', null).customer_email });

      let userd = user.get("customer", null);
      let userz = user.get("subscription", null);

      this.mixpanel.init("e3f475813524ce395975a3b628b15773").then((data) => {
        this.mixpanelPeople.identify(userd.customer_id);
        let loginProperties = {
          Email: userd.customer_email,
          Name: userd.first_name + ' ' + userd.last_name,
          'Tipe Login': tipe_login
        }
        this.mixpanel.track('LoginApp', loginProperties);
      });

      if (userz != null)
        this.registerPush(userz.subscription_id);
      if (trial == "1" || subs_status == "1") {
        this.rootPage = SubsHomePage;
      } else {
        this.rootPage = HomePage;
      }
    });

    events.subscribe('user:signup', (trial, subs_status, type) => {
      this.loggedIn = true;
      cordova.plugins.intercom.registerIdentifiedUser({ email: user.get('customer', null).customer_email });
      let userz = user.get("subscription", null);
      let userd = user.get("customer", null);

      this.mixpanel.init("e3f475813524ce395975a3b628b15773").then((data) => {
        let subs_id = 0;
        let subs_added;
        let subs_status = 0;

        if (userz != null) {
          subs_id = userz.subscription_id;
          subs_added = moment().local(userz.added);
          this.registerPush(userz.subscription_id);
          subs_status = userd.subscription_status;
        }

        this.mixpanelPeople.identify(userd.customer_id);
        this.mixpanelPeople.set({
          "$userId": userd.customer_id,
          "$name": userd.first_name + ' ' + userd.last_name,
          "$first_name": userd.first_name,
          "$last_name": userd.last_name,
          "$email": userd.customer_email,
          "$subscriptionId": subs_id,
          "$trial": userd.trial,
          "$signup_date": moment().local(userd.added),
          "$subscription_date": subs_added,
          "$subscription_status" : subs_status,
          "$referral_code": userd.customer_code
        });

        let signUpProperties = {
          'Created date': moment().local(userd.added),
          Email: userd.customer_email,
          Name: userd.first_name + ' ' + userd.last_name,
          'Tipe sign up': type
        }
        this.mixpanel.track('SignUpApp', signUpProperties);
      });

      if (trial == "1" || subs_status == "1") {
        this.rootPage = SubsHomePage;
      } else {
        this.rootPage = HomePage;
      }
    });

    events.subscribe('user:logout', (time) => {
      this.rootPage = WelcomePage;
      this.loggedIn = false;
      cordova.plugins.intercom.reset();
      this.auth.logout();
    });

    events.subscribe('user:subscribe', (trial, subs_status) => {
      let userz = user.get("subscription", null);
      this.registerPush(userz.subscription_id);
      if (trial == "1" || subs_status == "1") {
        this.rootPage = SubsHomePage;
      } else {
        this.rootPage = HomePage;
      }
    });

    events.subscribe('user:trial', (params, step) => {
      let userd = user.get("customer", null);

      this.mixpanel.init("e3f475813524ce395975a3b628b15773").then((data) => {
        this.mixpanelPeople.identify(userd.customer_id);
        this.mixpanelPeople.set({
          "$trial": '1',
        });

        let trialProperties = params
        trialProperties.Email = userd.customer_email,
          trialProperties.Name = userd.first_name + ' ' + userd.last_name,
          trialProperties.step = step
        this.mixpanel.track('TrialCheckoutApp', trialProperties);
      });
    });

    events.subscribe('user:subscheckout', (params, step) => {
      let userd = user.get("customer", null);
      let userz = user.get("subscription", null);

      this.mixpanel.init("e3f475813524ce395975a3b628b15773").then((data) => {
        this.mixpanelPeople.identify(userd.customer_id);
        if (userz) {
          let subs_id = userz.subscription_id;
          let subs_added = userz.added;
          let subs_status = userd.subscription_status;

          this.mixpanelPeople.set({
            "$subscriptionId": subs_id,
            "$subscription_date": moment().local(subs_added),
            "$subscription_status" : subs_status
          });
        }

        let subsProperties = params;
        subsProperties.Email = userd.customer_email;
        subsProperties.Name = userd.first_name + ' ' + userd.last_name;
        subsProperties.step = step;

        this.mixpanel.track('SubscriptionCheckoutApp', subsProperties);
      });
    });

    events.subscribe('user:skip', (order_data, skip_data) => {
      let userd = user.get("customer", null);

      this.mixpanel.init("e3f475813524ce395975a3b628b15773").then((data) => {
        this.mixpanelPeople.identify(userd.customer_id);

        let skipProperties = skip_data
        skipProperties.Email = userd.customer_email,
          skipProperties.Name = userd.first_name + ' ' + userd.last_name,

          this.mixpanel.track('Skip subscription App', skipProperties);
      });
    });

    events.subscribe('user:pause', (data, stop_data) => {
      let userd = user.get("customer", null);

      this.mixpanel.init("e3f475813524ce395975a3b628b15773").then((data) => {
        this.mixpanelPeople.identify(userd.customer_id);

        let pauseProperties = stop_data
        pauseProperties.Email = userd.customer_email,
          pauseProperties.Name = userd.first_name + ' ' + userd.last_name,

          this.mixpanel.track('Stop subscription App', pauseProperties);
      });
    });
  }

  registerPush(subs_id) {
    let pushz = this.push.init({
      android: {
        senderID: '312659605922',
        icon: 'icon',
        iconColor : '#03c9a9'
      }, ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      }
    });

    pushz.on('registration').subscribe((data: RegistrationEventResponse) => {
      //console.log("device token ->" + data.registrationId);
      let device_data = { subscription_id: subs_id, type: '', device: data.registrationId };
      if (this.platform.is('ios'))
        device_data.type = 'ios';
      else if (this.platform.is('android'))
        device_data.type = 'android';
      this.http.post("http://api.blackgarlic.id:7005/app/subscription/push/", device_data).map(res => res.json()).subscribe(data => {
        console.log("register on BG " + data.status);
      });
      this.mixpanelPeople.setPushId(data.registrationId).then((dataz) => {
        console.log("push token MX " + dataz);
      });
    });

    pushz.on('notification').subscribe((data: NotificationEventResponse) => {
      //console.log('message' + JSON.stringify(data));
      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: data.title,
          message: data.message,
          buttons: [{
            text: 'Tutup',
            role: 'cancel'
          }, {
              text: 'Buka',
              handler: () => {
                if (data.additionalData.topic == 'payment') {
                  this.nav.setRoot(SubsHomePage, { tabs: 2 });
                } else if (data.additionalData.topic == 'paymentResult') {
                  this.nav.setRoot(SubsHomePage, { tabs: 1 });
                }
                console.log("foreground push clicked");
              }
            }]
        });
        confirmAlert.present();
      } else {
        if (data.additionalData.topic == 'payment') {
          this.nav.setRoot(SubsHomePage, { tabs: 2 });
        } else if (data.additionalData.topic == 'paymentResult') {
          this.nav.setRoot(SubsHomePage, { tabs: 1 });
        }
        console.log("background Push notification clicked");
      }
      pushz.finish().then(function() {
        console.log("processing of push data is finished");
      }, function() {
        console.log("something went wrong with push.finish for ID = " + data.additionalData.notId)
      });
    });
  }
}
