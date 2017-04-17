import { Component } from '@angular/core';
import { NavController, NavParams,App, Events } from 'ionic-angular';
import { Auth } from '@ionic/cloud-angular';
import { SubscribeService } from '../../providers/subscribe-service';
import * as moment from 'moment';
import 'moment/locale/id';

import { Subsstep2Page } from './subsstep2';
import { WelcomePage } from '../welcome/welcome';

@Component({
  selector: 'page-subsstep1',
  templateUrl: 'subsstep1.html'
})

export class Subsstep1Page {
    subscribeStep1 = { city: '0', delivery_date: '', portion: '', menu_total: ''};
    step1check = { check1 : true, check2 : false, check3 : false, check4 : false };
    selectedDay = { day : "", first : ""};
    endOfNextWeek = moment().endOf('week').add(6,'d');
    startOfNextWeek = moment().startOf('week').add(8,'d');
    endOfWeek = moment().endOf('week').subtract(1,'d');
    thisWeek: any = [];
    nextWeek: any = [];
    d: any;
    subscribeData: any = {};

    constructor(private nav: NavController, public navParams: NavParams,public events: Events, public subscribeService : SubscribeService, public auth: Auth, public app: App) {
        this.d = moment();
        this.d = this.d.add(2,'days');

        if( this.d.hour() >= 15) {
           this.d = this.d.add(1,'d');
         }
        if(this.d.day() == 0) {
           this.d = this.d.add(2,'d');
        } else if(this.d.day() == 1) {
           this.d = this.d.add(1,'d');
        }

        while (this.d <= this.endOfWeek) {
          this.thisWeek.push({ date : this.d.locale("id").unix(), dateFormat :  this.d.locale("id").format("dddd, D MMMM") });
          this.d = this.d.clone().add(1, 'd');
        }

        while (this.startOfNextWeek <= this.endOfNextWeek) {
          this.nextWeek.push({date : this.startOfNextWeek.locale("id").unix(), dateFormat :  this.startOfNextWeek.locale("id").format("dddd, D MMMM") });
          this.startOfNextWeek = this.startOfNextWeek.clone().add(1, 'd');
        }
    }

    subsStep1(): void{
      this.subscribeData = this.subscribeService.getSubscribe();
      this.subscribeData.step1 = this.subscribeStep1;
      this.subscribeService.saveSubscribe(this.subscribeData);
      this.events.publish('user:subscheckout', this.subscribeStep1, '1');
      this.nav.push(Subsstep2Page);
    }

    selectDays() {
      this.step1check.check3 = true;
      let s = moment.unix(parseInt(this.subscribeStep1.delivery_date));
      this.selectedDay.day = s.locale('id').format('dddd');
      this.selectedDay.first = s.locale('id').format('dddd, DD MMMM');
    }

    ionViewCanEnter(){
      if(!this.auth.isAuthenticated()) {
        this.app.getRootNav().setRoot(WelcomePage);
      }
    }
}
