import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector : 'page-hiw',
  template: `<ion-content>
              <ion-slides pager>
                <ion-slide *ngFor="let slide of slides" padding>
                  <ion-toolbar>
                    <ion-buttons end>
                      <button ion-button (click)="dismiss()">
                        <span ion-text color="darkbg">Close</span>
                      </button>
                    </ion-buttons>
                  </ion-toolbar>
                  <img [src]="slide.image" class="slide-image"/>
                  <h2 class="slide-title" [innerHTML]="slide.title"></h2>
                  <p [innerHTML]="slide.description"></p>
                </ion-slide>
                <ion-slide style="background:url('assets/how/hiw_5.jpg');background-size:cover;color:#fff;font-size:1.6rem" padding>
                  <ion-toolbar>
                    <ion-buttons end>
                      <button ion-button (click)="dismiss()">
                        <span ion-text color="greenbg">Close</span>
                      </button>
                    </ion-buttons>
                  </ion-toolbar>
                  <h2 style="font-size:2rem;text-align:left;">
                    <span style="font-weight:100">Rencana Berubah?</span><br/>
                    <span style="font-weight:700">Berlangganan BlackGarlic sangat flexible</span>
                  </h2>
                  <p style="text-align:left;margin-top:30px">
                    <span style="font-weight:700">Berubah Pikiran?</span><br/>
                    Ganti menu, skip pengiriman, stop berlangganan kapan saja
                  </p>
                  <p style="text-align:left;"><span style="font-weight:700">Lebih banyak atau sedikit?</span><br/>
                    Kirim menu yang dikirimkan dalam jumlah yang lebih, atau kurangi
                  </p>
                  <button ion-button block color="greenbg" (click)="goReg()" style="margin-top:20px">Mulai Berlangganan</button>
                </ion-slide>
              </ion-slides>
            </ion-content>
  `
})

export class HowModal {
  slides : any = [];

  constructor(public viewCtrl: ViewController) {
    this.slides = [
      { image : 'assets/how/hiw_1.jpg', title : 'Mulai Berlangganan BlackGarlic', description : 'Daftar sekarang dan tentukan setiap makan malam Anda dengan mudah dan menyenangkan. Setiap minggu ada 11 menu istimewa menanti Anda.' },
      { image : 'assets/how/hiw_2.jpg', title : 'Box Diantarkan Setiap Minggu', description : 'BlackGarlic akan mengantarkan seluruh bahan baku memasak secara rutin, sesuai dengan hari yang telah Anda tentukan setiap minggu di dalam BOX.' },
      { image : 'assets/how/hiw_3.jpg', title : 'Memasak Jadi Lebih Menyenangkan', description : 'Setiap menu disertai dengan panduan memasak yang mudah. Seluruh bahan makanan telah ditakar dan dibungkus sesuai dengan porsi yang dipesan.' },
      { image : 'assets/how/hiw_4.jpg', title : 'Nikmati Makan Malam Istimewa', description : 'Setiap menu BlackGarlic merupakan kreasi Chef profesional yang diawasi langsung oleh pakar kuliner Indonesia, William Wongso.' }
    ];
  }

  dismiss() {
     this.viewCtrl.dismiss({return : 0});
  }
  goReg(){
    this.viewCtrl.dismiss({return: 1});
  }
}
