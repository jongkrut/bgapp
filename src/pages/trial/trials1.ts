import { Component } from '@angular/core';
import { NavController, NavParams, Events} from 'ionic-angular';
import { TrialStep2Page } from './trials2';
import { SubscribeService } from '../../providers/subscribe-service';
import * as moment from 'moment';
import 'moment/locale/id';

@Component({
    selector: 'page-trials1',
    templateUrl: 'trials1.html'
})
export class TrialStep1Page {
    subscribeStep1 = { city: '0', delivery_date: ''};
    step1check = { check1 : true, check2 : false};
    endOfNextWeek = moment().endOf('week').add(7, 'd');
    startOfNextWeek = moment().startOf('week').add(8, 'd');
    endOfWeek = moment().endOf('week');
    thisWeek: any = [];
    nextWeek: any = [];
    selectedDate: any;
    d: any;
    subscribeData: any = {};

    constructor(private nav: NavController, public navParams: NavParams, public subscribeService: SubscribeService,  public events: Events) {
        this.d = moment();
        this.d = this.d.add(2, 'days');

        if (this.d.hour() >= 15) {
            this.d = this.d.add(1, 'd');
        }

        if (this.d.day() == 0) {
            this.d = this.d.add(2, 'd');
        } else if (this.d.day() == 1) {
            this.d = this.d.add(1, 'd');
        }

        while (this.d <= this.endOfWeek) {
            this.thisWeek.push({
                date: this.d.unix(),
                dateFormat: this.d.locale('id').format('dddd, D MMMM')
            });
            this.d = this.d.clone().add(1, 'd');
        }

        console.log(JSON.stringify(this.thisWeek))
        while (this.startOfNextWeek <= this.endOfNextWeek) {
            this.nextWeek.push({
                date: this.startOfNextWeek.unix(),
                dateFormat: this.startOfNextWeek.locale('id').format('dddd, D MMMM')
            });
            this.startOfNextWeek = this.startOfNextWeek.clone().add(1, 'd');
        }
    }

    subsStep1(): void {
        console.log(JSON.stringify(this.subscribeStep1))
        this.subscribeData = this.subscribeService.getSubscribe();
        this.subscribeData.step1 = this.subscribeStep1;
        this.subscribeService.saveSubscribe(this.subscribeData);
        this.events.publish('user:trial',this.subscribeStep1, '1');
        this.nav.push(TrialStep2Page);
    }

    selectDays() {
      this.step1check.check2 = true;
      let s = moment.unix(parseInt(this.subscribeStep1.delivery_date));
      this.selectedDate = s.locale('id').format('dddd, DD MMMM');
    }
}
