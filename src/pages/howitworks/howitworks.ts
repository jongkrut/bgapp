import { Component } from '@angular/core';
import { NavController, NavParams,ModalController,Tabs, App } from 'ionic-angular';
import { HowModal } from './hiw';
import { WhyModal } from './whyus';
import { Subsstep1Page} from '../subscribe/subscribe';

@Component({
  selector: 'page-howitworks',
  templateUrl: 'howitworks.html'
})
export class HowitworksPage {

  constructor(public app:App, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,private tabs: Tabs) {}

  openModalHow(){
    let modal = this.modalCtrl.create(HowModal);
    modal.onDidDismiss((data)=>{
      if(data.return == 1)
          this.tabs.select(2);
    });
    modal.present();
  }

  openModalWhy(){
    let modal = this.modalCtrl.create(WhyModal);
    modal.onDidDismiss((data)=>{
      if(data.return == 1)
          this.tabs.select(2);
    });
    modal.present();
  }

  goReg(){
    this.app.getRootNav().push(Subsstep1Page);
  }
}
