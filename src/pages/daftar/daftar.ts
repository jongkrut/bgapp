import { Component } from '@angular/core';
import { NavController, NavParams, App, Events } from 'ionic-angular';
import { Auth } from '@ionic/cloud-angular';

import { WelcomePage} from '../welcome/welcome';
import { Subsstep1Page} from '../subscribe/subscribe';
import { TrialStep1Page} from '../trial/trials1';

@Component({
  selector: 'page-daftar',
  templateUrl: 'daftar.html'
})
export class DaftarPage {

  constructor(public app:App,public navCtrl: NavController, public navParams: NavParams, public auth:Auth, public events:Events) {}

  goTrial(){
    this.app.getRootNav().push(TrialStep1Page);
  }

  goSubscribe(){
    this.app.getRootNav().push(Subsstep1Page);
  }

  logout(){
    this.auth.logout();
    this.events.publish('user:logout', Date());
    this.app.getRootNav().setRoot(WelcomePage);
  }
}
