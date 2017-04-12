import { Component } from '@angular/core';
import { NavParams, ViewController} from 'ionic-angular';
import { User } from '@ionic/cloud-angular';
import { Http } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import * as cryptojs from 'crypto-js';
import * as moment from 'moment';
import 'moment/locale/id';

@Component({
  templateUrl: 'saldova.html'
})

export class SaldoVAPage {

  type : string;
  title : string;
  pages: Array<{title: string}>;
  va : string;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.type = navParams.get("va");
    if(this.type == 'bca') {
      this.title = 'BCA - Virtual Account';
    } else
      this.title = 'Permata - Virtual Account';
    this.va = navParams.get("num");
  }

  dismiss() {
     this.viewCtrl.dismiss();
  }
}

@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Topup SaldoBG</ion-title>
        <ion-buttons start>
          <button ion-button (click)="dismiss()">
            <span ion-text color="primary" showWhen="ios">Cancel</span>
            <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-list-header>
          Pilih nominal :
        </ion-list-header>
        <button ion-item (click)="chooseValue(50000)">
          50.000
        </button>
        <button ion-item (click)="chooseValue(100000)">
          100.000
        </button>
        <button ion-item (click)="chooseValue(150000)">
          150.000
        </button>
        <button ion-item (click)="chooseValue(250000)">
          250.000
        </button>
        <button ion-item (click)="chooseValue(500000)">
          500.000
        </button>
        <button ion-item (click)="chooseValue(1000000)">
          1.000.000
        </button>
      </ion-list>
    </ion-content>
  `
})
export class SaldoBrowserPage {

  type : string = "";

  constructor(public viewCtrl: ViewController, public navParams: NavParams, private user : User,private http : Http, private iab: InAppBrowser) {
    this.type = navParams.get("type");
  }

  chooseValue(val){
    let user_detail = this.user.get('customer',null);
    this.http.post("http://api.blackgarlic.id:7005/app/saldobg/topup",{ cust_id : user_detail.customer_id, value : val, type : this.type }).map(res => res.json()).subscribe(data => {

      let payScript = this.postDokuData(val,data.trx_id);

      let browser = this.iab.create('http://payment.blackgarlic.id/doku_mobile.html', '_blank','location=no');
      browser.on("loadstart").subscribe(
        event => {
          if(event.url.indexOf("https://blackgarlic.id") > -1){
             browser.close();
          }
        },
        err => {
          console.log("InAppBrowser loadstart Event Error: " + err);
      });
      browser.on("loadstop").subscribe(
         event => {
            browser.executeScript({
                code : payScript
             });
         },
         err => {
            console.log("InAppBrowser loadstop Event Error: " + err);
      });
      browser.on("exit").subscribe(
          event => {
            this.viewCtrl.dismiss();
      });
    });
  }

  dismiss() {
     this.viewCtrl.dismiss();
  }

  postDokuData(val,trx_id) {
    let user_detail = this.user.get('customer',null);
    let subs_detail = this.user.get('address',null);
    let unique_id = trx_id;
    let url = "https://pay.doku.com/Suite/Receive";
    let amount = val + ".00";
    let basket = "SaldoBG," + amount + ",1," + amount + ";";
    let mid = "";
    let keys = "";
    let channel = "";

    if(this.type == 'doku_wallet') {
        channel = '04';
        mid = "383";
        keys = "JVrCZkXH0urp";
    } else {
        keys = "Eg5qGN2lt51A";
        channel = '16';
        mid = "1115";
    }

    let wrds = cryptojs.SHA1(amount + mid + keys + unique_id).toString();
    let fields = {
    	    PAYMENTCHANNEL : channel,
    	    MALLID : mid,
    	    CHAINMERCHANT : 'NA',
    	    AMOUNT : amount,
    	    PURCHASEAMOUNT :  amount,
    	    TRANSIDMERCHANT : unique_id,
    	    WORDS : wrds,
    	    REQUESTDATETIME : moment().format('YYYYMMDDHHmmss'),
    	    CURRENCY : '360',
    	    PURCHASECURRENCY : '360',
    	    SESSIONID : "session_id",
    	    CUSTOMERID :  user_detail.customer_id,
    	    NAME : user_detail.first_name + " " + user_detail.last_name,
    	    ADDRESS : subs_detail.address_content,
    	    EMAIL : user_detail.customer_email,
    	    COUNTRY : 'ID',
    	    BASKET : basket
        };

    let formHtml:string = '';
    for(let key in fields){
       if (fields.hasOwnProperty(key)) {
           let value = fields[key];
          formHtml+='<input type="hidden" value="'+value+'" id="'+key+'" name="'+key+'"/>';
       }
    }

    let payScript = "var form = document.getElementById('ts-app-payment-form-redirect'); ";
    payScript += "form.innerHTML = '" + formHtml + "';";
    payScript += "form.action = '" + url + "';";
    payScript += "form.method = 'POST';" ;
    payScript += "form.submit();" ;

    return payScript;
  }
}
