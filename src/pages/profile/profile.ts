import { Component } from '@angular/core';
import { ViewController,NavController, NavParams, PopoverController, ModalController } from 'ionic-angular';
import { User } from '@ionic/cloud-angular';
import { Http } from '@angular/http';
import { SocialSharing } from 'ionic-native';


@Component({
  templateUrl: 'profile.html'
})
export class ProfilePage {

  detail : any = {};
  address : any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public user : User, private popoverCtrl: PopoverController, private http : Http, private modalCtrl : ModalController) { }

  doRefresh(refresher) {
    refresher.complete();
  }

  editProfile() {
    let modal = this.modalCtrl.create(EditProfile);
    modal.present();
  }
  ionViewWillEnter() {
    this.detail = this.user.get('customer',null);
    this.address = this.user.get('address',null);
  }
  shareCode(){
    let ref_code = this.user.get('customer',null).customer_code;
    let msg = "Mau masak pakai BlackGarlic? Gunakan kode referral "+ ref_code +" untuk mendapatkan diskon 30% box pertama Anda berlangganan BlackGarlic!";
    let subject = "Mau masak pakai BlackGarlic? Gunakan kode referral "+ ref_code +" untuk mendapatkan diskon 30% box pertama Anda berlangganan BlackGarlic!";
    let file = "https://cdnbg.kilatstorage.com/bg_referral_share.jpg";
    let url = "https://blackgarlic.id/user/"+ ref_code;
    SocialSharing.share(msg,subject,file,url);
  }
}


@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Ubah Detil</ion-title>
        <ion-buttons start>
          <button ion-button (click)="dismiss()">
            <span ion-text color="primary" showWhen="ios">Cancel</span>
            <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <form novalidate (ngSubmit)="saveProfile()" #profForm="ngForm">
        <ion-list>
          <ion-item>
            <ion-label stacked>Nama Depan</ion-label>
            <ion-input type="text" [(ngModel)]="details.first_name" name="first_name" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label stacked>Nama Belakang</ion-label>
            <ion-input type="text" [(ngModel)]="details.last_name" name="last_name" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label stacked>Email</ion-label>
            <ion-input type="email" [(ngModel)]="details.customer_email" name="customer_email" required></ion-input>
          </ion-item>
        </ion-list>
        <button ion-button type="submit" block [disabled]="!profForm.form.valid">Save Profile</button>
      </form>
    </ion-content>
  `
})
export class EditProfile {

  details : any = {};

  constructor(public viewCtrl: ViewController, private navParams: NavParams, public user : User) {
    this.details = user.get('customer',null);
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  saveProfile() {
    this.user.set('customer',this.details);
    this.viewCtrl.dismiss();
  }
}
