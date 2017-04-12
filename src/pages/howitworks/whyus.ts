import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector : 'page-whyus',
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
                  <p style="text-align:left;margin-top:20px">
                    <span style="font-weight:700">Berubah Pikiran?</span><br/>
                    Ganti menu, skip pengiriman, stop berlangganan kapan saja
                  </p>
                  <p style="text-align:left;"><span style="font-weight:700">Lebih banyak atau sedikit?</span><br/>
                    Kirim menu yang dikirimkan dalam jumlah yang lebih, atau kurangi
                  </p>
                  <p style="text-align:left;"><span style="font-weight:700">Rencana mendadak?</span><br/>
                    Ubah hari pengiriman dari minggu ke minggu
                  </p>
                  <button ion-button block color="greenbg" (click)="goReg()" style="margin-top:20px">Mulai Berlangganan</button>
                </ion-slide>
              </ion-slides>
            </ion-content>
  `
})

export class WhyModal {
  slides : any = [];

  constructor(public viewCtrl: ViewController) {
    this.slides = [
      { image : 'assets/how/wbg_1.jpg', title : '10 Menu Kreasi Chef Profesional', description : 'Chef BlackGarlic menyajikan 11 menu istimewa untuk Anda pilih setiap minggu, setiap makan malam Anda jadi lebih mudah dan istimewa.' },
      { image : 'assets/how/wbg_2.jpg', title : 'Waktu Anda Sangat Berharga', description : 'Dapatkan waktu lebih banyak untuk bersama keluarga Anda atau melakukan hal lain yang Anda sukai.' },
      { image : 'assets/how/wbg_3.jpg', title : 'Bahan Baku Berkualitas', description : 'Seluruh bahan baku BlackGarlic disediakan oleh vendor profesional yang terpercaya dibidangnya.' },
      { image : 'assets/how/wbg_4.jpg', title : 'Masak Praktis Anti Gagal', description : 'Setiap menu datang dengan panduan memasak yang sangat mudah dimengerti. Tidak ada lagi masakan gagal di dapur Anda.' }
    ];
  }

  dismiss() {
     this.viewCtrl.dismiss({return : 0});
  }
  goReg(){
    this.viewCtrl.dismiss({return: 1});
  }
}
