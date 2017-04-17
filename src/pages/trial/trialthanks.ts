import { Component } from '@angular/core';
import { NavController, App,  ModalController } from 'ionic-angular';
import { SubscribeService } from '../../providers/subscribe-service';
import { User } from '@ionic/cloud-angular';
import * as moment from 'moment';
import 'moment/locale/id';

import {SubsHomePage} from '../subshome/subshome';

@Component({
  selector: 'page-trialthanks',
  templateUrl: 'trialthanks.html'
})
export class TrialthanksPage {

  delivery_date : string;
  pay_date : string;
  s : number = 0;
  total : number;

  constructor( private navCtrl: NavController, private subsService: SubscribeService, private user : User,  public modalCtrl : ModalController, private app: App) {
    let subs : any = this.subsService.getSubscribe();
    this.total = subs.cartDetail.total;
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
