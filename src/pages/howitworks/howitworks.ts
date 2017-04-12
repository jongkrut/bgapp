import { Component } from '@angular/core';
import { NavController, NavParams,ModalController,Tabs } from 'ionic-angular';
import { HowModal } from './hiw';
import { WhyModal } from './whyus';

@Component({
  selector: 'page-howitworks',
  templateUrl: 'howitworks.html'
})
export class HowitworksPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,private tabs: Tabs) {}

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

  goReg(val){
    this.tabs.select(2);
  }
}
