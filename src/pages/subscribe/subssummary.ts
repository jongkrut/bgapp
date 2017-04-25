import { Component } from '@angular/core';
import { NavController, NavParams, App, Events } from 'ionic-angular';
import { SubscribeService } from '../../providers/subscribe-service';
import { SubsthanksPage } from './substhanks';
import { Http } from '@angular/http';
import { User } from '@ionic/cloud-angular';
import 'rxjs/add/operator/map';
import * as moment from 'moment';
import 'moment/locale/id';

@Component({
  selector: 'page-subssummary',
  templateUrl: 'subssummary.html'
})
export class SubssummaryPage {

    cart = [];
    subscribe: any;
    total = 0;
    menuPrice: any;
    diskon: any;
    order: any;
    date: any;
    buttonOrder: any = true;
    url: string = 'http://api.blackgarlic.id:7005/app/subscription/subscribe/';

    constructor(public nav: NavController, public navParams: NavParams, public subscribeService: SubscribeService,  private user: User,  public http: Http, private app: App, public events: Events) {
        this.subscribe = this.subscribeService.getSubscribe();
        this.cart = this.subscribe.cart;
        this.date = moment.unix(this.subscribe.step1.delivery_date).locale("id").format('dddd, Do MMMM');
        this.subscribe.step1.delivery_day = moment.unix(this.subscribe.step1.delivery_date).locale("id").isoWeekday();
        this.diskon = this.subscribe.cartDetail.diskon;
        this.total = this.subscribe.cartDetail.total_items;
        this.subscribe.user = user.get('customer', null);
    }

    subsSummary(): void {
        this.subscribeService.saveSubscribe(this.subscribe);
        let postData = { 'step1' : JSON.stringify(this.subscribe.step1), 'step2' : JSON.stringify(this.subscribe.step2), 'cart' : JSON.stringify(this.subscribe.cart), 'cartDetail' : JSON.stringify(this.subscribe.cartDetail), 'user' : JSON.stringify(this.subscribe.user)};
        //console.log(JSON.stringify(postData));
        this.http.post(this.url, postData)
          .map(res => res.json())
          .subscribe(data => {
              //console.log('success')
              console.log(data)
              this.user.set("subscription", data.subscription);
              this.user.set("customer", data.customer);
              this.user.save();
              this.events.publish('user:subscheckout',data, '4');
          });
        this.app.getRootNav().setRoot(SubsthanksPage);
     }
}
