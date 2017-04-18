import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { SubscribeService } from '../../providers/subscribe-service';
import * as moment from 'moment';
import 'moment/locale/id';

import {SubsHomePage} from '../subshome/subshome';

@Component({
  selector: 'page-substhanks',
  templateUrl: 'substhanks.html'
})
export class SubsthanksPage {

  delivery_date : string = "Monday, 21 January";
  pay_date : string = "Sunday, 20 January"
  s : number = 0;

  constructor( private navCtrl: NavController, private subsService: SubscribeService, private app: App) {
    let subs : any = this.subsService.getSubscribe();
    this.delivery_date = moment.unix(subs.step1.delivery_date).locale("id").format('dddd, Do MMMM');
    this.pay_date = moment.unix(subs.step1.delivery_date).subtract(2,'days').locale("id").format('dddd, Do MMMM');
  }

  ionViewDidEnter(){
    this.s=1;
  }

  select(val){
    if(this.s == 1) {
      this.app.getRootNav().setRoot(SubsHomePage);
    }
  }
}
