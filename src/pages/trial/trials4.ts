import { Component } from '@angular/core';
import { NavController, NavParams, App, ModalController, Events, ViewController } from 'ionic-angular';
import { SubscribeService } from '../../providers/subscribe-service';
import { TrialthanksPage } from './trialthanks';
import { User } from '@ionic/cloud-angular';
import { Http, Headers} from '@angular/http';
import {InAppBrowser} from 'ionic-native';
import 'rxjs/add/operator/map';
import * as moment from 'moment';
import * as cryptojs from 'crypto-js';

@Component({
  selector: 'page-subsstepsummarytrial',
  templateUrl: 'subsstepsummarytrial.html'
})
export class TrialStep4Page {

  data: any = null;
  dataSubscribe: any = null;
  subscribeData = [];
  cart = [];
  subscribe: any;
  total = 0;
  menuPrice: any;
  order: any;
  date: any;
  total_menu: any;
  payment_method = null;
  buttonOrder: any = true;
  checked: boolean;
  customer_id: number;
  url: string = 'http://api.blackgarlic.id:7005/app/subscription/trial/';
  bca_va: string = '';
  permata_va: string = '';

  i = 0;
  constructor(public viewCtrl: ViewController, private app: App, public nav: NavController, private user: User, private events: Events, public navParams: NavParams, public subscribeService: SubscribeService, public http: Http, public modalCtrl: ModalController) {
    this.getPosts();
  }

  getPosts() {
    this.customer_id = this.user.get('customer', null).customer_id;
    this.subscribe = this.subscribeService.getSubscribe();
    this.cart = this.subscribe.cart;
    this.total_menu = this.subscribe.cartDetail.total_menu;
    console.log(this.cart)
    this.subscribe.cart.portion = this.subscribe.step1.portion;
    this.date = moment(parseInt(this.subscribe.step1.delivery_date)).locale("id").format('dddd, Do MMMM');
    console.log(JSON.stringify(this.date))
    this.subscribe.step1.delivery_day = moment(parseInt(this.subscribe.step1.delivery_date)).locale("id").isoWeekday();
  }

  check(e) {
    this.checked = false;
    console.log(this.checked)
    return this.checked;

  }

  approval() {
    if (this.checked == true && this.payment_method != null) {
      this.buttonOrder = false;
    }
    if (this.checked == true && this.payment_method == null) {
      this.buttonOrder = true;
    }
    if (this.checked == false) {
      this.buttonOrder = true;
    }
  }

  button() {
    return this.buttonOrder;
  }

  subsSummary(): void {
    this.subscribe.cartDetail.payment_method = this.payment_method;
    this.subscribe.user = this.user.get('customer', null);
    console.log(JSON.stringify(this.subscribe.cartDetail))
    this.subscribeService.saveSubscribe(this.subscribe);
    this.events.publish('user:trial', this.subscribe.cartDetail, '4');
    var subscribeData = { 'step1': JSON.stringify(this.subscribe.step1), 'step2': JSON.stringify(this.subscribe.step2), 'cart': JSON.stringify(this.subscribe.cart), 'cartDetail': JSON.stringify(this.subscribe.cartDetail), 'user': JSON.stringify(this.subscribe.user) };

    this.http.post(this.url, subscribeData)
      .map(res => res.json())
      .subscribe(data => {
        console.log('success')
        console.log(data)
        this.data = data;
        console.log(JSON.stringify(this.data))

        this.user.set("trial", data.trial);
        this.user.set("customer", data.customer);
        this.user.save();

        if (this.payment_method == 'va') {
          this.app.getRootNav().setRoot(TrialthanksPage);
        } else {

          console.log(this.payment_method)
          let trx_id = data.trial.unique_id;
          let keyz = "APP";

          let payScript = this.postDokuData(this.subscribe.cartDetail.total, trx_id);

          let browser = new InAppBrowser('http://payment.blackgarlic.id/doku_mobile.html', '_blank', 'location=no');
          browser.on("loadstart").subscribe(
            event => {
              if (event.url.indexOf("https://blackgarlic.id") > -1) {
                browser.close();
              }
            },
            err => {
              console.log("InAppBrowser loadstart Event Error: " + err);
            });
          browser.on("loadstop").subscribe(
            event => {
              browser.executeScript({
                code: payScript
              });
            },
            err => {
              console.log("InAppBrowser loadstop Event Error: " + err);
            });

          browser.on("exit").subscribe(
            event => {
              this.viewCtrl.dismiss();
            });
        }
      });
  }

  postDokuData(val, trx_id) {
    let user_detail = this.user.get('customer', null);
    let subs_detail = this.user.get('address', null);
    let unique_id = trx_id;
    let url = "https://pay.doku.com/Suite/Receive";
    let amount = val + ".00";
    let basket = "Trial Box," + amount + ",1," + amount + ";";
    let mid = "";
    let keys = "";
    let channel = "";

    keys = "Eg5qGN2lt51A";
    channel = '16';
    mid = "1115";


    let wrds = cryptojs.SHA1(amount + mid + keys + unique_id).toString();
    let fields = {
      PAYMENTCHANNEL: channel,
      MALLID: mid,
      CHAINMERCHANT: 'NA',
      AMOUNT: amount,
      PURCHASEAMOUNT: amount,
      TRANSIDMERCHANT: unique_id,
      WORDS: wrds,
      REQUESTDATETIME: moment().format('YYYYMMDDHHmmss'),
      CURRENCY: '360',
      PURCHASECURRENCY: '360',
      SESSIONID: "session_id",
      CUSTOMERID: user_detail.customer_id,
      NAME: user_detail.first_name + " " + user_detail.last_name,
      ADDRESS: this.subscribe.step2.address_content,
      EMAIL: user_detail.customer_email,
      COUNTRY: 'ID',
      BASKET: basket
    };

    let formHtml: string = '';
    for (let key in fields) {
      if (fields.hasOwnProperty(key)) {
        let value = fields[key];
        formHtml += '<input type="hidden" value="' + value + '" id="' + key + '" name="' + key + '"/>';
      }
    }

    let payScript = "var form = document.getElementById('ts-app-payment-form-redirect'); ";
    payScript += "form.innerHTML = '" + formHtml + "';";
    payScript += "form.action = '" + url + "';";
    payScript += "form.method = 'POST';";
    payScript += "form.submit();";

    return payScript;
  }

}
