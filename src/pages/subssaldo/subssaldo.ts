import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, Events,Tabs } from 'ionic-angular';
import { User } from '@ionic/cloud-angular';
import { SaldoVAPage, SaldoBrowserPage } from './saldova';
import { Http } from '@angular/http';
import { SocialSharing } from 'ionic-native';

@Component({
  selector: 'page-subssaldo',
  templateUrl: 'subssaldo.html'
})

export class SubsSaldoPage {

  saldobg : number;
  listtype : string = 'topup';
  customer_id : number;
  history : any = {};
  customer_code : string = '';
  nextorder : number = 0;
  bca_va : string = '';
  permata_va : string = '';
  autotopup : number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private user : User, private loadingCtrl : LoadingController, public modalCtrl : ModalController, private http: Http, private events: Events, private tabs: Tabs) {
    this.customer_id = user.get('customer',null).customer_id;
    this.saldobg = user.get('customer',null).balance;
    this.customer_code = user.get('customer',null).customer_code;
    this.bca_va = "74100 "+("000000000"+this.customer_id).slice(-11);
    this.permata_va = "8545 5600 "+("000000000"+this.customer_id).slice(-8);
    this.autotopup = user.get('subscription', null);

console.log(this.autotopup)

    http.get('http://api.blackgarlic.id:7005/app/saldobg/'+this.customer_id).map(res => res.json())
      .subscribe(data => {
        this.history = data.history;
        if(data.order)
          this.nextorder = data.order.grandtotal;
        if(data.customer.balance != this.saldobg) {
          this.saldobg = data.customer.balance;
          this.user.set('customer', data.customer);
          this.user.save();
        }
    });
  }

  doRefresh(refresher) {
    this.http.get('http://api.blackgarlic.id:7005/app/saldobg/'+this.customer_id).map(res => res.json())
      .subscribe(data => {
        this.history = data.history;
        if(data.order)
          this.nextorder = data.order.grandtotal;
        if(data.customer.balance != this.saldobg) {
          this.saldobg = data.customer.balance;
          this.user.set('customer', data.customer);
          this.user.save();
          this.events.publish('saldobg:update', this.saldobg);
        }
        refresher.complete();
    });
  }

  openModalVA(va_val) {
    let inp = { va: va_val, num : ''};
    if(va_val == 'bca')
      inp.num = this.bca_va;
    else
      inp.num = this.permata_va;
    let profileModal = this.modalCtrl.create(SaldoVAPage, inp );
    profileModal.present();
  }

  openModalBrowser(type) {
    let profileModal = this.modalCtrl.create(SaldoBrowserPage, { type: type });
    profileModal.onDidDismiss(() => {
      this.http.get('http://api.blackgarlic.id:7005/app/saldobg/'+this.customer_id).map(res => res.json())
        .subscribe(data => {
          this.history = data.history;
          if(data.order)
            this.nextorder = data.order.grandtotal;
          if(data.customer.balance != this.saldobg) {
            this.saldobg = data.customer.balance;
            this.user.set('customer', data.customer);
            this.user.save();
            this.events.publish('saldobg:update', this.saldobg);
          }
      });
    });
    profileModal.present();
  }

  shareCode(){
    let ref_code = this.user.get('customer',null).customer_code;
    let msg = "Mau masak pakai BlackGarlic? Gunakan kode referral "+ ref_code +" untuk mendapatkan diskon 30% box pertama Anda berlangganan BlackGarlic!";
    let subject = "Mau masak pakai BlackGarlic? Gunakan kode referral "+ ref_code +" untuk mendapatkan diskon 30% box pertama Anda berlangganan BlackGarlic!";
    let file = "https://cdnbg.kilatstorage.com/bg_referral_share.jpg";
    let url = "https://blackgarlic.id/user/"+ ref_code;
    SocialSharing.share(msg,subject,file,url);
  }

  goToOrder() {
    this.tabs.select(1);
  }
}
