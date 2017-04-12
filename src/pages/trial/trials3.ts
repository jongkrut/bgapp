import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, LoadingController, Events} from 'ionic-angular';
import { Http, Headers  } from '@angular/http';
import { SubscribeService } from '../../providers/subscribe-service';
import { TrialStep4Page } from './trials4';
import 'rxjs/add/operator/map';
import * as moment from 'moment';
import 'moment/locale/id';

@Component({
  selector: 'page-trials3',
  templateUrl: 'trials3.html',
  styles: [`
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
export class TrialStep3Page {

  @ViewChild(Content) content: Content;

  total_items: number = 0;
  orderParams: any = {};
  menus: any = [];
  cart: any = [];
  total_price: number = 0;
  order_detail: any = {};
  data: any = null;
  cartDetail: any = {};
  subscribeData: any = {};
  cart_total: number = 0;

  constructor(public nav: NavController, public navParams: NavParams,  public events: Events, public http: Http, public subscribeService: SubscribeService, private loadingCtrl: LoadingController) {
    let loading = this.loadingCtrl.create({
      content: 'Loading up menus...'
    });
    loading.present();

    let d: any;
    let url: string;

    this.subscribeData = this.subscribeService.getSubscribe();
    this.subscribeData.cart = [];
    this.subscribeData.cartDetail = {};
    d = moment();
    d = d.add(2, 'days');

    if (d.hour() >= 15) {
      d = d.add(1, 'd');
    }
    if (d.day() == 0) {
      d = d.add(2, 'd');
    } else if (d.day() == 1) {
      d = d.add(1, 'd');
    }

    url = 'http://api.blackgarlic.id:7005/app/menu/week/' + d.format('YYYY-MM-DD');
    this.http.get(url)
      .map(res => res.json())
      .subscribe(data => {
        let i = 0;
        let j = 0;
        this.menus = JSON.parse(data);
        while (i < this.menus.length) {
          j = 0;
          while (j < this.menus[i].menu_prices.length) {
            this.menus[i].menu_prices[j].qty = 0;
            j++;
          }
          i++;
        }
        console.log(this.menus)
        loading.dismissAll();
      });
  }


  update(m, mp, type) {

    let curqty: number = parseInt(this.menus[m].menu_prices[mp].qty);

    if (type == 1) { // add 1
      curqty += 1;
      this.total_items += 1;
      this.total_price += this.menus[m].menu_prices[mp].menu_price;
    } else { // minus 1
      curqty -= 1;
      this.total_items -= 1;
      this.total_price -= this.menus[m].menu_prices[mp].menu_price;
    }

    this.menus[m].menu_prices[mp].qty = curqty;

  }

  subscribe() {
    this.cart = [];
    let i = 0;
      let j = 0;

      while (i < this.menus.length) {
          j = 0;
          while (j < this.menus[i].menu_prices.length) {
              if (this.menus[i].menu_prices[j].qty > 0) {
                  this.cart.push({
                      box_id: this.menus[i].box_id,
                      menu_id: this.menus[i].menu_id,
                      menu_name: this.menus[i].menu_name,
                      menu_price: this.menus[i].menu_prices[j].menu_price,
                      portion: this.menus[i].menu_prices[j].portion,
                      qty: this.menus[i].menu_prices[j].qty
                  });
                }
              j++;
          }
          i++;
      }

    console.log(this.cart);
    let deliveryfee: number = 20000;
    let totalbayar: number = this.total_price + deliveryfee;

    this.subscribeData.cartDetail = {
      "total_harga": this.total_price,
      "delivery_fee": deliveryfee,
      "total": totalbayar,
      "total_menu" : this.total_items
    };

    this.events.publish('user:trial', this.cart[0], '3');
    this.subscribeData.cart = this.cart;
    this.subscribeService.saveSubscribe(this.subscribeData);
    this.nav.push(TrialStep4Page);
  }

  disableAdd() {
  if (this.total_items <= 1 || this.total_price < 150000) {
    return false;
  }
}

}
