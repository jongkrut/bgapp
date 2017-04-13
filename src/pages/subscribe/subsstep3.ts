import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { SubscribeService } from '../../providers/subscribe-service';
import { SubssummaryPage } from './subssummary';
import 'rxjs/add/operator/map';
import * as moment from 'moment';
import 'moment/locale/id';

@Component({
    selector: 'page-subsstep3',
    templateUrl: 'subsstep3.html',
    styles : [`
      ion-card {
        background-color:#fff !important;
      }
      .portion {
        font-size:12px;
        border-right:1px solid #bfbfbf;
        float:left;
        width:50%;
      }
      .price{
        font-size:12px;
        padding-left:10px;
        float:left;
        width:50%;
      }
      .portion span, .price span {
        font-size:10px;
        color:#444;
      }
      ion-col.qty {
        text-align:center;
        line-height:30px;
        background-color:#f5f5f5;
        font-size:105%;
      }
      .btnz {
        align-items: center;
        justify-content: center;
        display: flex;
      }
      .btnz button{
        background-color:#444;
        color:white;
        padding:3px;
        width:20px;
      }
      .menu_name {
        font-size:14px;
      }
      .menu_tag {
        font-size:10px;
        margin-bottom:3px;
        font-weight:300;
      }
      .price_cont {
        border-top:1px solid #bfbfbf;
        padding:5px !important;
      }
      .box_qty {
        float:left;
        padding-left:5px;
        padding-right:10px;
        border-right:1px solid #bfbfbf;
      }
      .box_qty span {
        font-size:75%;
        font-weight:300;
      }
      .box_price {
        float:left;
        padding-left:10px;
      }
      .box_price span {
        font-size:75%;
        font-weight:300;
      }
      `]
})
export class Subsstep3Page {

    total_items: number = 0;
    total_discount : number = 0;
    total_price: number = 0;
    menus: any = [];
    cart: any = [];
    data: any = [];
    url: string;
    diskon = 0.2;
    cartDetail : any = {};
    subscribeData: any = {};


    constructor(public nav: NavController, public navParams: NavParams, public http: Http, public subscribeService: SubscribeService, private loadingCtrl: LoadingController,public events: Events) {
        let loading = this.loadingCtrl.create({
          content: 'Loading up menus...'
        });
        loading.present();

        this.subscribeData = this.subscribeService.getSubscribe();
        this.subscribeData.cart = [];
        this.subscribeData.cartDetail = {};
        let d = moment.unix(this.subscribeData.step1.delivery_date);

        this.url = 'http://api.blackgarlic.id:7005/app/menu/week/' + d.format('YYYY-MM-DD') + '/' + this.subscribeData.step1.portion;
        this.http.get(this.url).map(res => res.json()).subscribe(data => {
            this.data = data;
            for(let d of this.data) {
                d.qty = 0;
            }
            loading.dismissAll();
        });
    }

    update(m, type) {
        let curqty: number = parseInt(this.data[m].qty);
        if (type == 1) { // add 1
            curqty += 1;
        } else { // minus 1
            curqty -= 1;
        }
        this.data[m].qty = curqty;
        this.total_items = 0;
        this.total_price = 0;
        this.cart = [];
        for(let d of this.data) {
          if(d.qty > 0) {
            for(var i = 0;i<d.qty;i++) {
              this.total_items += 1;
              this.total_price += d.menu_price;
              this.total_discount = this.diskon * this.total_price;
              this.cart.push({
                "box_id" : d.box_id,
                "menu_id" : d.menu_id,
                "menu_name" : d.menu_name,
                "menu_price" : d.menu_price,
                "portion" : d.portion,
                "qty" : 1,
                "menu_type" : d.menu_type
              });
            }
          }
        }
    }

   subscribe(){
     let grandtotal = this.total_price - this.total_discount;
     this.subscribeData.cartDetail = {"diskon" : this.total_discount, "total" : grandtotal, "total_items" : this.total_items};
     this.subscribeData.cart = this.cart;
     this.subscribeData.step1.menu_total = this.total_items;
     this.events.publish('user:subscheckout',this.cart[0], '3');
     this.subscribeService.saveSubscribe(this.subscribeData);
     this.nav.push(SubssummaryPage);
   }

   disableAdd() {
     if (this.total_items <= 1 || this.total_price < 150000) {
       return false;
     }
   }
}
