import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { SubscribeService } from '../../providers/subscribe-service';
import { TrialStep3Page } from './trials3';

@Component({
  selector: 'page-trials2',
  templateUrl: 'trials2.html'
})
export class TrialStep2Page {
  subsUserData = {customer_name: '', address_content: '', zipcode: '', mobile: '', address_notes: ''};
  subscribeData : any;

  constructor(public nav: NavController, public navParams: NavParams, public subscribeService : SubscribeService,  public events: Events) {
    this.subscribeService.getSubscribe();
  }

  subsStep2(): void{
    this.subscribeData = this.subscribeService.getSubscribe();
    this.subscribeData.step2 = this.subsUserData;
    this.subscribeService.saveSubscribe(this.subscribeData);
    this.events.publish('user:trial',this.subsUserData, '2');
    this.nav.push(TrialStep3Page);

  }

}
