import { NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { MenuPage } from '../menu/menu';
import { DaftarPage } from '../daftar/daftar';
import { HowitworksPage } from '../howitworks/howitworks';

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = MenuPage;
  tab2Root: any = HowitworksPage;
  tab3Root: any = DaftarPage;

  constructor(public navParams: NavParams) {
  }
}
