import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { DetailModal } from './detail';
import 'rxjs/add/operator/map';
import { SplashScreen } from '@ionic-native/splash-screen';

import * as moment from 'moment';
import 'moment/locale/id';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})

export class MenuPage {

  week : string;
  week_ids : string[] = [];
  menus1 : any[] = [];
  menus2 : any[] = [];
  allmenus;

  constructor(public splashScreen: SplashScreen, public navCtrl: NavController, public http: Http, public modalCtrl : ModalController, public loadingCtrl: LoadingController) { }

  ionViewDidLoad() {
    this.loadMenu();
  }

  openDetail(menu_id) {
    let detailModal = this.modalCtrl.create(DetailModal, { menu_id : menu_id });
    detailModal.present();
  }

  doRefresh(refresher) {
    this.menus1  = [];
    this.menus2  = [];
    this.week_ids = [];
    this.loadMenu();
    refresher.complete();
  }

  loadMenu(){
      let loader = this.loadingCtrl.create({
        content: "Loading ..."
      });
      loader.present();

      let d = moment();
      d = d.add(2,'days');
      if(d.hour() >= 15) {
        d = d.add(1,'d');
      }
      if(d.day() == 0) {
        d = d.add(2,'d');
      } else if(d.day() == 1) {
        d = d.add(1,'d');
      }

      this.http.get('http://api.blackgarlic.id:7005/app/menu/weeks/'+d.format('YYYY-MM-DD')).map(res => res.json()).subscribe(data => {
          this.allmenus = JSON.parse(data);
          for(var i = 0;i< this.allmenus.length;i++){
            this.week_ids.push(this.allmenus[i].box_id);
          }
          this.week_ids = this.week_ids.filter((x, i, a) => a.indexOf(x) == i);
          this.week = "" + this.week_ids[0];
          for(var i = 0;i< this.allmenus.length;i++){
            if(this.allmenus[i].box_id == this.week_ids[0]) {
                this.menus1.push(this.allmenus[i]);
            } else {
                this.menus2.push(this.allmenus[i]);
            }
          }
          loader.dismiss();
      });
  }
}
