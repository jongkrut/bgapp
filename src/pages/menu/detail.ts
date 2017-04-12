import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { ViewController, NavParams } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';
import { SocialSharing } from '@ionic-native/social-sharing';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-mdetails',
  templateUrl: 'detail.html',
  styles: [`
      .share {
        background-color:#ececec;
        padding:10px;
        margin-top:15px;
        border-radius:3px;
        font-weight:500;
        color:#666;
        text-align:center;
      }
      .detail_content {
        background-color:#ececec;
        padding:10px;
        margin-top:15px;
        border-radius:3px;
        font-weight:500;
        color:#666;
      }
      .menu_type {
        margin-bottom:10px;
        font-size:1rem;
        font-weight:300;
      }
      .menu_name {
        margin-bottom:5px;
      }
      .menu_desc {
        padding-top:10px;
        border-top:2px solid #666;
        line-height:16px;
        font-size:1.2rem;
      }
      .kal_h {
        font-weight:400;
        color:#666;
      }
      .kal_c {
        font-weight:400;
        color:#666;
      }
  `],
  providers : [SocialSharing]
})

export class DetailModal {

  menu_id: number;
  menu: any = {};
  message : any;
  image: any;
  url: any;
  menu_name: any;

  constructor(public viewCtrl: ViewController, public http: Http, private navParams: NavParams, public socialSharing: SocialSharing) {
    this.menu_id = navParams.get("menu_id");
    this.http.get('http://api.blackgarlic.id:7005/app/menu/id/' + this.menu_id).map(res => res.json())
      .subscribe(data => {
        this.menu = JSON.parse(data);
          this.menu_name = this.menu.menu_name;
          console.log(this.menu, this.menu_name)
          this.message = this.menu_name + ' hanya ada di BlackGarlic!';
          this.image = 'http://bgmenu.kilatstorage.com/' + this.menu_id + '.jpg';
          this.url = 'https://blackgarlic.id/menu/' + this.menu_name.split(' ').join('-') + '/';

      });



  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  openPDF() {
    let browser = new InAppBrowser('https://bgpdf.kilatstorage.com/' + this.menu_id + ".pdf", '_system', 'location=yes');
  }

  fbShare() {
    this.socialSharing.shareViaFacebook(this.message, this.image, this.url).then(() => {
      console.log('success')// Success!
    }).catch((error) => {
      console.log('error')
    });
  }

  twitterShare() {
    this.socialSharing.shareViaTwitter(this.message, this.image, this.url).then(() => {
      // Success!
      console.log('success')
    }).catch(() => {
      // Error!
        console.log('error')
    });
  }
  instagramShare() {
    this.socialSharing.shareViaInstagram(this.message, this.image).then(() => {
      // Success!
      console.log('success')
    }).catch(() => {
      // Error!
        console.log('error')
    });
  }
  whatsappShare() {
    this.socialSharing.shareViaWhatsApp(this.message, this.image, this.url).then(() => {
      // Success!
      console.log('success')
    }).catch(() => {
      // Error!
        console.log('error')
    });
  }
}
