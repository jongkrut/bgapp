import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, Events, Tabs, ViewController, ToastController, AlertController} from 'ionic-angular';
import { User } from '@ionic/cloud-angular';
import { SaldoVAPage, SaldoBrowserPage } from './saldova';
import { Http } from '@angular/http';
import { SocialSharing } from 'ionic-native';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import 'rxjs/add/operator/map';
import * as moment from 'moment';
import * as cryptojs from 'crypto-js';

@Component({
  selector: 'page-subssaldo',
  templateUrl: 'subssaldo.html'
})

export class SubsSaldoPage {

  data: any = null;
  saldobg: number;
  listtype: string = 'autotopup';
  customer_id: number;
  history: any = {};
  customer_code: string = '';
  nextorder: number = 0;
  bca_va: string = '';
  permata_va: string = '';
  autotopup: number;
  subscription_id: number;
  saldobgexp: any;
  referral_list: any = {};

  constructor(private iab: InAppBrowser, public viewCtrl: ViewController, public alertCtrl: AlertController, public navCtrl: NavController, private toastCtrl: ToastController, public navParams: NavParams, private user: User, private loadingCtrl: LoadingController, public modalCtrl: ModalController, private http: Http, private events: Events, private tabs: Tabs) {
    this.customer_id = user.get('customer', null).customer_id;
    this.subscription_id = user.get('customer', null).subscription_id;
    this.saldobg = user.get('customer', null).balance;
    this.customer_code = user.get('customer', null).customer_code;
    this.bca_va = "74100 " + ("000000000" + this.customer_id).slice(-11);
    this.permata_va = "8545 5600 " + ("000000000" + this.customer_id).slice(-8);
    this.autotopup = user.get('customer', null).credit_status;
    this.saldobgexp = moment(user.get('customer', null).last_update).locale("id").add(3, 'M').format('D MMMM YYYY');
    console.log(this.autotopup)

    http.get('http://api.blackgarlic.id:7005/app/saldobg/' + this.customer_id).map(res => res.json())
      .subscribe(data => {
        this.history = data.history;
        this.referral_list = data.referral;
        if (data.order)
          this.nextorder = data.order.grandtotal;
        if (data.customer.balance != this.saldobg) {
          this.saldobg = data.customer.balance;
          this.user.set('customer', data.customer);
          this.user.save();
        }
        this.user.set('customer', data.customer);
        this.user.save();
        this.autotopup = this.user.get('customer', null).credit_status;
        this.events.publish('autotopup:update', this.autotopup);
      });
  }

info(){
  let toast = this.toastCtrl.create({
   message: 'Pastikan SaldoBG Anda cukup untuk pemotongan berikutnya',
   duration: 2000,
   position: 'middle'
 });

 toast.present();
}
  topup(credit_status) {

    if (this.autotopup == 0) {

      let trx_id = "BG" + (Math.floor(Math.random() * 90000) + 10000);
      let payScript = this.postDokuData(trx_id);

      let browser = this.iab.create('http://payment.blackgarlic.id/doku_mobile.html', '_blank', 'location=no');
      browser.on("loadstart").subscribe(
        event => {
          if (event.url.indexOf("https://blackgarlic.id") > -1) {
            browser.close();
            console.log('iap stop')
          }
          console.log('iap start')
        },
        err => {
          console.log("InAppBrowser loadstart Event Error: " + err);
        });
      browser.on("loadstop").subscribe(
        event => {
          browser.executeScript({
            code: payScript
          });
          console.log(payScript)
        },
        err => {
          console.log("InAppBrowser loadstop Event Error: " + err);
        });

      browser.on("exit").subscribe(
        event => {
          this.viewCtrl.dismiss();
        });

    } else {

      let ttl = "Konfirmasi"
      let msg = "Anda yakin ingin mengubah status AutoTopup?";

      let alert = this.alertCtrl.create({
        title: ttl,
        message: msg,
        buttons: [
          {
            text: 'Batal',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }, {
            text: 'Ya',
            handler: () => {

              this.http.post('http://api.blackgarlic.id:7005/app/credit_status/', { 'credit_status': credit_status, 'subscription_id': this.subscription_id })
                .map(res => res.json())
                .subscribe(data => {
                  console.log('success')
                  let loading = this.loadingCtrl.create({
                    content: 'Initializing...'
                  });
                  loading.present();
                  this.http.get('http://api.blackgarlic.id:7005/app/saldobg/' + this.customer_id).map(res => res.json())
                    .subscribe(data => {
                      this.user.set('customer', data.customer);
                      this.user.save();
                      this.autotopup = this.user.get('customer', null).credit_status;
                      this.events.publish('autotopup:update', this.autotopup);
                      console.log(this.autotopup)

                      loading.dismiss();
                      if (credit_status == 1) {
                        let toast = this.toastCtrl.create({
                          message: 'AutoTopup Anda telah diaktifkan',
                          duration: 2000
                        });
                        toast.present();
                      } else if (credit_status == 2) {
                        let toast = this.toastCtrl.create({
                          message: 'AutoTopup Anda telah dinon-aktifkan',
                          duration: 2000
                        });
                        toast.present();
                      }
                    });
                });
            }
          }]
      });
      alert.present();
    }

  }

  postDokuData(trx_id) {
    let user_detail = this.user.get('customer', null);
    let subs_detail = this.user.get('address', null);
    let unique_id = trx_id;
    let url = "https://pay.doku.com/Suite/Receive";
    let amount = "0.00";
    let basket = "Black Garlic Subscription,10000.00,1,10000.00;";
    let mid = "";
    let keys = "";
    let channel = "";
    let day = moment(user_detail.delivery_day).isoWeekday() - 2;
    console.log(day)
    if (day < 0) {
      day = 6;
    }
    keys = "Eg5qGN2lt51A";
    channel = '17';
    mid = "623";


    let wrds = cryptojs.SHA1(mid + "NA" + unique_id + amount + keys).toString();
    let fields = {
      PAYMENTCHANNEL: channel,
      MALLID: mid,
      CHAINMERCHANT: 'NA',
      AMOUNT: amount,
      PURCHASEAMOUNT: amount,
      TRANSIDMERCHANT: user_detail.subscription_id,
      WORDS: wrds,
      REQUESTDATETIME: moment().format('YYYYMMDDHHmmss'),
      CURRENCY: '360',
      PURCHASECURRENCY: '360',
      SESSIONID: "session_id",
      CUSTOMERID: user_detail.customer_id,
      NAME: user_detail.first_name + " " + user_detail.last_name,
      ADDRESS: subs_detail.address_content,
      EMAIL: user_detail.customer_email,
      COUNTRY: 'ID',
      BASKET: basket,
      BILLNUMBER: user_detail.subscription_id,
      BILLDETAIL: "BlackGarlic Subscription",
      BILLTYPE: "I",
      STARTDATE: moment().format('YYYYMMDD'),
      ENDDATE: moment().add(3, 'y').format('YYYYMMDD'),
      EXECUTETYPE: day,
      EXECUTEDATE: moment().isoWeekday(day).locale('en').format('ddd'),
      EXECUTEMONTH: "Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec",
      FLATSTATUS: "FALSE"
    };
    console.log(fields)

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

  doRefresh(refresher) {
    this.http.get('http://api.blackgarlic.id:7005/app/saldobg/' + this.customer_id).map(res => res.json())
      .subscribe(data => {
        this.history = data.history;
        this.referral_list = data.referral;
        if (data.order)
          this.nextorder = data.order.grandtotal;
        if (data.customer.balance != this.saldobg) {
          this.saldobg = data.customer.balance;
          this.user.set('customer', data.customer);
          this.user.save();
          this.events.publish('saldobg:update', this.saldobg);
        }
        this.user.set('customer', data.customer);
        this.user.save();
        this.autotopup = this.user.get('customer', null).credit_status;
        this.events.publish('autotopup:update', this.autotopup);
        refresher.complete();
      });
  }

  openModalVA(va_val) {
    let inp = { va: va_val, num: '' };
    if (va_val == 'bca')
      inp.num = this.bca_va;
    else
      inp.num = this.permata_va;
    let profileModal = this.modalCtrl.create(SaldoVAPage, inp);
    profileModal.present();
  }

  openModalBrowser(type) {
    let profileModal = this.modalCtrl.create(SaldoBrowserPage, { type: type });
    profileModal.onDidDismiss(() => {
      this.http.get('http://api.blackgarlic.id:7005/app/saldobg/' + this.customer_id).map(res => res.json())
        .subscribe(data => {
          this.history = data.history;
          this.referral_list = data.referral;
          if (data.order)
            this.nextorder = data.order.grandtotal;
          if (data.customer.balance != this.saldobg) {
            this.saldobg = data.customer.balance;
            this.user.set('customer', data.customer);
            this.user.save();
            this.events.publish('saldobg:update', this.saldobg);
          }
        });
    });
    profileModal.present();
  }

  shareCode() {
    let ref_code = this.user.get('customer', null).customer_code;
    let msg = "Mau masak pakai BlackGarlic? Gunakan kode referral " + ref_code + " untuk mendapatkan diskon 30% box pertama Anda berlangganan BlackGarlic!";
    let subject = "Mau masak pakai BlackGarlic? Gunakan kode referral " + ref_code + " untuk mendapatkan diskon 30% box pertama Anda berlangganan BlackGarlic!";
    let file = "https://cdnbg.kilatstorage.com/bg_referral_share.jpg";
    let url = "https://blackgarlic.id/user/" + ref_code;
    SocialSharing.share(msg, subject, file, url);
  }

  goToOrder() {
    this.tabs.select(1);
  }
}
