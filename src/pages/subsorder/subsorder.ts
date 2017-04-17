import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, ViewController, NavParams, LoadingController, App, AlertController, Events, ModalController, Tabs} from 'ionic-angular';
import { Auth, User } from '@ionic/cloud-angular';
import * as moment from 'moment';
import 'moment/locale/id';
import { EditOrderPage } from '../order/editorder';
import { Subsstep1Page } from '../subscribe/subscribe';

@Component({
  selector: 'page-subsorder',
  templateUrl: 'subsorder.html'
})

export class SubsOrderPage {

  customer_id: number;
  subscription: any = {};
  orderDetail: any = [{}];
  orderD: any = [{}];
  order: any = {};
  saldobg: number;
  trial: any;
  next_order_date: any = null;
  next_order_day: any = null;
  showWhich: number = -1;
  bca_va: string = '';
  permata_va: string = '';
  subscriptionStatus: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App, public http: Http, private user: User, private auth: Auth,
      private loadingCtrl: LoadingController, private alertCtrl: AlertController, private events: Events, private modalCtrl: ModalController, private tabs: Tabs) { }

  ionViewDidLoad() {
      this.subscription = this.user.get('subscription', null);
      this.customer_id = this.user.get('customer', null).customer_id;
      this.saldobg = this.user.get('customer', null).balance;
      this.trial = this.user.get('customer', null).trial;

      if (this.subscription.subscription_status == 1)
          this.subscriptionStatus = true;
      else
          this.subscriptionStatus = false;

      this.events.subscribe('menu-update', () => {
          this.reloadMenu();
      });
      this.events.subscribe('saldobg:update', () => {
          this.saldobg = this.user.get('customer', null).balance;
      });

      this.reloadMenu();
  }

  trialDetail() {
      this.http.get("http://api.blackgarlic.id:7005/app/order/trial/" + this.customer_id).map(res => res.json()).subscribe(data => {
          this.orderD = data;
          for (let ord of this.orderD) {
              ord.payDate = moment(ord.order_date).locale("id").subtract(2, 'days').hour(15);
              ord.payDate1 = moment(ord.order_date).locale("id").subtract(1, 'days').hour(15);
              ord.showAddr = false;
              ord.marker = 0;
              ord.canChange = false;
              ord.daysleft = "";
              let currentdate = moment().locale("id");
              ord.bca_va = "74100 " + ("100 000" + ord.order_id).slice(-11);
              ord.permata_va = "8545 5600 " + ("100" + ord.order_id).slice(-8);

              if (currentdate.isBefore(ord.payDate)) {
                  ord.daysleft = ord.payDate.from(currentdate, true);
                  ord.canChange = true;
                  ord.marker = 1;
              }
          }

          if (this.orderDetail.length == 2) {
            this.showWhich = 1;
            if (this.orderDetail[0].order_status >= 0 && this.orderDetail[0].order_status < 2)
              this.showWhich = 0;
            if (this.orderDetail[0].order_status == 2)
              this.showWhich = 1;
          } else {
            this.showWhich = 0;
          }
      });
  }
  doRefresh(refresher) {
      refresher.complete();
      this.reloadMenu();
  }

  skip(order_id, ind) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Alasan anda skip minggu ini?');
    alert.addInput({
      type: 'radio',
      label: 'Menu kurang menarik',
      value: 'Menu kurang menarik',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Sedang tidak makan di rumah',
      value: 'Sedang tidak makan di rumah'
    });
    alert.addInput({
      type: 'radio',
      label: 'Harga di atas anggaran',
      value: 'Harga di atas anggaran'
    });
    alert.addInput({
      type: 'radio',
      label: 'Masih ada box minggu sebelumnya',
      value: 'Masih ada box minggu sebelumnya'
    });
    alert.addInput({
      type: 'radio',
      label: 'Sedang malas memasak',
      value: 'Sedang malas memasak'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        let order_data = { order_id: order_id, delivery: 0, reason: data };
        let loader = this.loadingCtrl.create({
          content: "Skipping ..."
        });
        loader.present();
        this.http.post("http://api.blackgarlic.id:7005/app/order/skip/", order_data).map(res => res.json()).subscribe(data => {
          loader.dismiss();
          if (data.status == 1) {
            this.orderDetail[ind].payment_status = -1;
            this.orderDetail[ind].order_status = -1;
          }
          this.events.publish('user:skip',order_data, data);
        });
      }
    });
    alert.present();
  }

  unskip(order_id, ind) {
    let order_data = { order_id: order_id, delivery: 1 };
    let loader = this.loadingCtrl.create({
      content: "Skipping ..."
    });
    loader.present;
    this.http.post("http://api.blackgarlic.id:7005/app/order/skip/", order_data).map(res => res.json()).subscribe(data => {
      loader.dismiss();
      if (data.status == 1) {
        this.orderDetail[ind].payment_status = 0;
        this.orderDetail[ind].order_status = 0;
      }
    });
  }

  editOrder(order_id, box_id) {
      this.app.getRootNav().push(EditOrderPage, { order_id: order_id, box_id: box_id });
  }

  editAddress(order_id, ind) {
    let address_detail = {
      customer_name: this.orderDetail[ind].customer_name, address_content: this.orderDetail[ind].address_content,
      mobile: this.orderDetail[ind].mobile, city: this.orderDetail[ind].city, zipcode: this.orderDetail[ind].zipcode,
      address_notes: this.orderDetail[ind].address_notes
    };
    let modal = this.modalCtrl.create(EditOrderAddress, { order_id: order_id, address: address_detail });
    modal.onDidDismiss(data => {
      this.orderDetail[ind].customer_name = data.customer_name;
      this.orderDetail[ind].address_content = data.address_content;
      this.orderDetail[ind].mobile = data.mobile;
      this.orderDetail[ind].city = data.city;
      this.orderDetail[ind].zipcode = data.zipcode;
      this.orderDetail[ind].address_notes = data.address_notes;
    });
    modal.present();
  }

  subscribeNow() {
    this.app.getRootNav().push(Subsstep1Page);
  }

  goSaldo() {
    this.tabs.select(2);
  }

  reloadMenu() {
    if (this.trial == 1 && this.subscription == null) {
        this.trialDetail();
    } else {
      let loader = this.loadingCtrl.create({
        content: "Loading Your Order..."
      });
      loader.present();

      this.http.get("http://api.blackgarlic.id:7005/app/order/customer/" + this.customer_id).map(res => res.json()).subscribe(data => {
          this.orderDetail = data;
          moment.locale('id');
          for (let ord of this.orderDetail) {
              ord.payDate = moment(ord.order_date).locale("id").subtract(2, 'days').hour(15);
              ord.payDate1 = moment(ord.order_date).locale("id").subtract(1, 'days').hour(15);
              ord.showAddr = false;
              ord.marker = 0;
              ord.canChange = false;
              ord.daysleft = "";
              let currentdate = moment().locale("id");
              let currdate = moment().locale("id").isoWeekday();
              let deldate = this.subscription.delivery_day;

              if (currdate <= deldate) {
                this.next_order_day = moment().locale("id").isoWeekday(this.subscription.delivery_day).format('dddd');
                this.next_order_date = moment().locale("id").isoWeekday(this.subscription.delivery_day).format('D MMMM YYYY');
              }
              if (currdate > deldate) {
                this.next_order_day = moment().locale("id").isoWeekday(this.subscription.delivery_day).add(7, 'd').format('dddd');
                this.next_order_date = moment().locale("id").isoWeekday(this.subscription.delivery_day).add(7, 'd').format('D MMMM YYYY');
              }
              ord.order_day = moment(ord.order_date).locale("id").format('dddd');
              ord.order_date = moment(ord.order_date).locale("id").format('D MMMM YYYY');

              if (currentdate.isBefore(ord.payDate)) {
                  ord.daysleft = ord.payDate.from(currentdate, true);
                  ord.canChange = true;
                  ord.marker = 1;
              }
          }

          this.showWhich = 0;
          if (this.orderDetail.length == 2) {
              if (this.orderDetail[1].order_status >= 0 && this.orderDetail[1].order_status < 2)
                  this.showWhich = 1;
              if (this.orderDetail[1].order_status == 2)
                  this.showWhich = 0;
          }
          loader.dismiss();
      });
    }
  }

  pauseSubscription(stat) {
    let ttl = "Konfirmasi Lanjut Langganan";
    let msg = "Dengan melanjutkan berlangganan, Anda akan menerima rekomendasi menu dan box mingguan BlackGarlic lagi. Anda bisa stop langganan kapan saja.";
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
            let postData = { subscription_id: this.user.get('subscription', null).subscription_id, pause: stat };
            this.http.post("http://api.blackgarlic.id:7005/app/subscription/pause/", postData).map(res => res.json()).subscribe(data => {
              if (data.status > 0) {
                this.subscription.subscription_status = data.status;
                this.user.save();
                this.subscription = this.user.get('subscription', null);
              }
              if (this.subscription.subscription_status == 1)
                this.subscriptionStatus = true;
              else
                this.subscriptionStatus = false;
            });
          }
        }]
    });
    alert.present();
  }
}

@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Ubah Alamat Pengantaran</ion-title>
        <ion-buttons start>
          <button ion-button (click)="dismiss()">
            <span ion-text color="primary" showWhen="ios">Cancel</span>
            <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <form novalidate (ngSubmit)="saveAddress()" #addrForm="ngForm">
        <ion-list>
          <ion-note style="color:#444">
            Perubahan ini hanya berlaku untuk pengantaran ini saja.
          </ion-note>
          <ion-item>
            <ion-label stacked>Penerima</ion-label>
            <ion-input type="text" [(ngModel)]="details.customer_name" name="customer_name"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label stacked>Alamat Lengkap</ion-label>
            <ion-textarea [(ngModel)]="details.address_content" name="address_content" required></ion-textarea>
          </ion-item>
          <ion-item>
            <ion-label stacked>Kota</ion-label>
            <ion-select [(ngModel)]="details.city" name="city">
              <ion-option value="1">Jakarta Pusat</ion-option>
              <ion-option value="2">Jakarta Selatan</ion-option>
              <ion-option value="3">Jakarta Barat</ion-option>
              <ion-option value="4">Jakarta Utara</ion-option>
              <ion-option value="5">Jakarta Timur</ion-option>
              <ion-option value="6">Tangerang </ion-option>
              <ion-option value="7">Bekasi Kota</ion-option>
              <ion-option value="8">Tangerang Selatan</ion-option>
              <ion-option value="9">Depok</ion-option>
              <ion-option value="10">Bogor</ion-option>
              <ion-option value="11">Tambun</ion-option>
              <ion-option value="12">Cikarang</ion-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label stacked>Kode Pos</ion-label>
            <ion-input type="text" [(ngModel)]="details.zipcode" name="zipcode"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label stacked>Telepon</ion-label>
            <ion-input type="tel" [(ngModel)]="details.mobile" name="mobile" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label stacked>Catatan Pengantaran</ion-label>
            <ion-textarea [(ngModel)]="details.address_notes" name="address_notes"></ion-textarea>
          </ion-item>
        </ion-list>
        <button ion-button color="greenbg" type="submit" block [disabled]="!addrForm.form.valid">Save Address</button>
      </form>
  `
})
export class EditOrderAddress {

  type: number = 0;
  details: any = {};

  constructor(public viewCtrl: ViewController, private navParams: NavParams, private loadingCtrl: LoadingController, private http: Http) {
      this.type = navParams.get('order_id');
      this.details = navParams.get('address');
  }
  dismiss() {
      this.viewCtrl.dismiss(this.details);
  }
  saveAddress() {
      let order_detail = { order_id: this.type, details: this.details };
      let loader = this.loadingCtrl.create({
          content: "Skipping ..."
      });
      loader.present();
      this.http.post("http://api.blackgarlic.id:7005/app/order/address/", order_detail).map(res => res.json()).subscribe(data => {
          loader.dismiss();
          this.viewCtrl.dismiss(this.details);
      });
  }
}
