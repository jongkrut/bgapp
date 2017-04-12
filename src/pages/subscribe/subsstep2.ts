import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { SubscribeService } from '../../providers/subscribe-service';
import 'rxjs/add/operator/map';

import { Subsstep3Page } from './subsstep3';

@Component({
    selector: 'page-subsstep2',
    templateUrl: 'subsstep2.html'
})
export class Subsstep2Page {
    subsUserData = {customer_name: '', address_content: '', zipcode: '', mobile: '', address_notes: ''};
    subscribeData : any;

    constructor(public nav: NavController, public navParams: NavParams, public subscribeService : SubscribeService,public events: Events) {
        this.subscribeData = this.subscribeService.getSubscribe();
        if(this.subscribeData.step2) {
            this.subsUserData.customer_name = this.subscribeData.step2.customer_name;
            this.subsUserData.address_content = this.subscribeData.step2.address_content;
            this.subsUserData.zipcode = this.subscribeData.step2.zipcode;
            this.subsUserData.mobile = this.subscribeData.step2.mobile;
            this.subsUserData.address_notes = this.subscribeData.step2.address_notes;
        }
    }

    subsStep2(): void{
        this.subscribeData = this.subscribeService.getSubscribe();
        this.subscribeData.step2 = this.subsUserData;
        this.subscribeService.saveSubscribe(this.subscribeData);
        this.events.publish('user:subscheckout',this.subsUserData, '2');
        this.nav.push(Subsstep3Page);
    }
}
