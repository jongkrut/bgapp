import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '@ionic/cloud-angular';
import { Http } from '@angular/http';

@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html'
})
export class FeedbackPage {

  feedback: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public user: User, public http: Http, public alertCtrl : AlertController) {}

  sendFeedback(){
      this.feedback.email = this.user.get('customer',null).customer_email;
      this.http.post("http://api.blackgarlic.id:7005/app/feedback/",this.feedback).map(res => res.json()).subscribe(data => {
        let alert = this.alertCtrl.create({
          title: 'Terima Kasih untuk Feedback Anda',
          buttons: [{
            text: 'Tutup',
            handler: () => {
                  alert.dismiss();
                  this.navCtrl.pop();
            }
          }]
        });
        alert.present();
      });
  }
}
