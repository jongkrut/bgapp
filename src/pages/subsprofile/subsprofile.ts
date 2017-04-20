import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, AlertController, Events } from 'ionic-angular';
import { User,Auth } from '@ionic/cloud-angular';
import { Http } from '@angular/http';
import { AuthPage } from '../auth/auth';

@Component({
  selector: 'page-subsprofile',
  templateUrl: 'subsprofile.html'
})
export class SubsProfilePage {

  subscription : any = {};
  address : any = {};
  subscriptionStatus : boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private events: Events, private user: User,private auth: Auth, private modalCtrl : ModalController, private alertCtrl: AlertController) { }

  pauseSubscription(stat) {
      let ttl = "Konfirmasi Lanjut Langganan";
      let msg = "Dengan melanjutkan berlangganan, Anda akan menerima rekomendasi menu dan box mingguan BlackGarlic lagi. Anda bisa stop langganan kapan saja.";
      if(stat == 2) {
          ttl = "Konfirmasi Stop Langganan";
          msg = "Dengan berhenti berlangganan, Anda tidak akan menerima rekomendasi menu dan box mingguan BlackGarlic lagi. Anda bisa hidupkan kembali kapan saja.";
      }
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
          },{
            text: 'Ya',
            handler: () => {
              let postData = { subscription_id : this.user.get('subscription',null).subscription_id, pause : stat };
              this.http.post("http://api.blackgarlic.id:7005/app/subscription/pause/", postData).map(res => res.json()).subscribe(data => {
                  if(data.status > 0) {
                    this.subscription.subscription_status = data.status;
                    this.user.set("subscription", this.subscription);
                    this.user.save();
                    this.subscription = this.user.get('subscription',null);
                  }
                  if(this.subscription.subscription_status == 1)
                    this.subscriptionStatus = true;
                  else
                    this.subscriptionStatus = false;
                    this.events.publish('user:pause', postData, data);
              });
            }
          }]
      });
      alert.present();
  }

  editAddress(){
    let modal = this.modalCtrl.create(SubsProfileEditPage, {});
    modal.onDidDismiss(data => {
      this.subscription = this.user.get('subscription',null);
      this.address = this.user.get('address',null);
      if(this.subscription.subscription_status == 1)
        this.subscriptionStatus = true;
      else
        this.subscriptionStatus = false;
    });
    modal.present();
  }

  editProfile(){
    let modal = this.modalCtrl.create(SubsEditPage, {});
    modal.onDidDismiss(data => {
      this.subscription = this.user.get('subscription',null);
      this.address = this.user.get('address',null);
      if(this.subscription.subscription_status == 1)
        this.subscriptionStatus = true;
      else
        this.subscriptionStatus = false;
    });
    modal.present();
  }

  ionViewDidEnter() {
    this.subscription = this.user.get('subscription',null);
    this.address = this.user.get('address',null);
    if(this.subscription.subscription_status == 1)
      this.subscriptionStatus = true;
    else
      this.subscriptionStatus = false;
  }

  ionViewCanEnter(){
    if(!this.auth.isAuthenticated()) {
      this.navCtrl.setRoot(AuthPage);
    }
  }
}


@Component({
  template: `<ion-header>
              <ion-toolbar>
                <ion-title>Ubah Profil Langganan</ion-title>
                <ion-buttons start>
                  <button ion-button (click)="dismiss()">
                    <span ion-text color="primary" showWhen="ios">Cancel</span>
                    <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
                  </button>
                </ion-buttons>
              </ion-toolbar>
            </ion-header>
            <ion-content padding>
              <form novalidate (ngSubmit)="saveProfile()" #profileForm="ngForm">
                <ion-list>
                  <ion-item>
                    <ion-label>Hari Pengiriman</ion-label>
                    <ion-select [(ngModel)]="postData.delday" name="delday">
                      <ion-option value="1">Senin</ion-option>
                      <ion-option value="2">Selasa</ion-option>
                      <ion-option value="3">Rabu</ion-option>
                      <ion-option value="4">Kamis</ion-option>
                      <ion-option value="5">Jumat</ion-option>
                      <ion-option value="6">Sabtu</ion-option>
                    </ion-select>
                  </ion-item>
                  <ion-item>
                    <ion-label>Jumlah Menu per Pengiriman</ion-label>
                    <ion-select [(ngModel)]="postData.totalmenu" name="totalmenu">
                      <ion-option value="2">2</ion-option>
                      <ion-option value="3">3</ion-option>
                      <ion-option value="4">4</ion-option>
                      <ion-option value="5">5</ion-option>
                      <ion-option value="6">6</ion-option>
                    </ion-select>
                  </ion-item>
                  <ion-item>
                    <ion-label>Porsi per Menu</ion-label>
                    <ion-select [(ngModel)]="postData.portion" name="portion">
                      <ion-option value="2">Porsi 2 Orang</ion-option>
                      <ion-option value="4">Porsi 4 Orang</ion-option>
                    </ion-select>
                  </ion-item>
                </ion-list>
                <button ion-button type="submit" block color="greenbg">Save</button>

              </form>
            </ion-content>`
})
export class SubsEditPage {

  postData : any = {};
  subscription : any = {};

  constructor( public viewCtrl : ViewController, public navParams: NavParams, private user: User, private http: Http) {
    this.subscription = user.get('subscription',null);
    this.postData.delday = this.subscription.delivery_day;
    this.postData.portion = this.subscription.portion;
    this.postData.totalmenu = this.subscription.menu_total;
    this.postData.subscription_id = this.subscription.subscription_id;
  }

  saveProfile(){
    this.http.post("http://api.blackgarlic.id:7005/app/subscription/profile/update/", this.postData).map(res => res.json()).subscribe(data => {
      this.user.set('subscription',data);
      this.user.save();
      this.viewCtrl.dismiss();
    });
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
}


@Component({
  template: `<ion-header>
              <ion-toolbar>
                <ion-title>Ubah Alamat Langganan</ion-title>
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
                  <ion-item>
                    <ion-label stacked>Nama Penerima</ion-label>
                    <ion-textarea [(ngModel)]="postData.customer_name" name="customer_name" required></ion-textarea>
                  </ion-item>
                  <ion-item>
                    <ion-label stacked>Alamat Lengkap</ion-label>
                    <ion-textarea [(ngModel)]="postData.address_content" name="address_content" required></ion-textarea>
                  </ion-item>
                  <ion-item>
                    <ion-label stacked>Kota</ion-label>
                    <ion-select [(ngModel)]="postData.city" name="city">
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
                    <ion-input type="text" [(ngModel)]="postData.zipcode" name="zipcode"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label stacked>Telepon</ion-label>
                    <ion-input type="tel" [(ngModel)]="postData.mobile" name="mobile" required></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label stacked>Catatan Pengantaran</ion-label>
                    <ion-textarea [(ngModel)]="postData.address_notes" name="address_notes"></ion-textarea>
                  </ion-item>
                </ion-list>
                <button ion-button type="submit" block [disabled]="!addrForm.form.valid" color="greenbg">Save Address</button>
              </form>
            </ion-content>`
})
export class SubsProfileEditPage {

  postData : any = {};
  subscription : any = {};

  constructor( public viewCtrl : ViewController, public navParams: NavParams, private user: User, private http: Http) {
    this.subscription = user.get('address',null);
    this.postData.customer_name = this.subscription.customer_name;
    this.postData.address_content = this.subscription.address_content;
    this.postData.city = this.subscription.city;
    this.postData.mobile = this.subscription.mobile;
    this.postData.zipcode = this.subscription.zipcode;
    this.postData.address_notes = this.subscription.address_notes;
    this.postData.subscription_id = this.subscription.subscription_id;
  }

  saveAddress(){
      this.http.post("http://api.blackgarlic.id:7005/app/subscription/address/update/", this.postData).map(res => res.json()).subscribe(data => {
      this.user.set('subscription',data.subscription);
      this.user.set('address',data.address);
      this.user.save();
      this.viewCtrl.dismiss();
    });
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
}
