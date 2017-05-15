import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, NavParams, LoadingController, Events, App, Platform, AlertController, ToastController, Content } from 'ionic-angular';
import { Http } from '@angular/http';
import { User } from '@ionic/cloud-angular';
import { SubsHomePage } from '../subshome/subshome';

@Component({
  selector: 'edit-order',
  templateUrl: 'editorder.html'
})
export class EditOrderPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Nav) nav: Nav;

  menus: any = [];
  cart: any = [];
  total_price: number = 0;
  box_id: any = {};
  order_id: number;
  carttotal: number = 0;
  alert: any;
  unregisterBackButtonAction: any;

  constructor(public navParams: NavParams, private http: Http, private navCtrl: NavController, private app: App, private platform: Platform,
    private alertCtrl: AlertController, private loadingCtrl: LoadingController, private events: Events, private toastCtrl: ToastController, private user: User) {
    let loading = this.loadingCtrl.create({
      content: 'Loading up menus...'
    });
    loading.present();

    this.order_id = navParams.get('order_id');
    this.box_id = navParams.get('box_id');

    http.get("http://api.blackgarlic.id:7005/app/order/menu/" + this.order_id).map(res => res.json()).subscribe(data => {
      let menu = data.menu;
      let menus = data.menus;

      for (let m of menus) {
        for (var i = 0; i < menu.length; i++) {
          if (m.menu_id == menu[i].menu_id) {
            if (m.menu_prices[0].portion == menu[i].portion)
              m.menu_prices[0].qty = menu[i].count;
            else
              m.menu_prices[1].qty = menu[i].count;
            this.carttotal += menu[i].count;
            this.cart.push({ menu_id: m.menu_id, menu_name: m.menu_name, menu_type: m.menu_type, menu_prices: m.menu_prices });
            break;

          }
          if (i == (menu.length - 1)) {
            this.menus.push({ menu_id: m.menu_id, menu_name: m.menu_name, menu_type: m.menu_type, menu_prices: m.menu_prices });
            break;
          }
        }
      }
      this.recalcTotal();
      loading.dismiss();
    });
  }

  goUp() {
    this.content.scrollToTop();
  }

  update(m, mp, type) {
    let curqty: number = parseInt(this.cart[m].menu_prices[mp].qty);
    if (type == 1)
      curqty += 1;
    else
      curqty -= 1;

    this.cart[m].menu_prices[mp].qty = curqty;
    if (curqty == 0) {
      let toast = this.toastCtrl.create({
        message: 'Menu telah dihapus dari Box',
        duration: 1000
      });
      toast.present();

      // check if all qty == 0
      if (this.cart[m].menu_prices[0].qty == 0 && this.cart[m].menu_prices[1].qty == 0) {
        let item = this.cart[m];
        this.cart.splice(m, 1);
        this.menus.push(item);
      }
    }
    this.recalcTotal();
  }

  plus(m, mp) {
    let toast = this.toastCtrl.create({
      message: 'Menu telah ditambahkan ke Box',
      duration: 1000
    });
    toast.present();

    let curqty: number = parseInt(this.menus[m].menu_prices[mp].qty);
    curqty += 1;
    this.menus[m].menu_prices[mp].qty = curqty;

    let item = this.menus[m];
    this.menus.splice(m, 1);
    this.cart.push(item);
    this.recalcTotal();
  }

  recalcTotal() {
    this.total_price = 0;
    this.carttotal = 0;
    for (let item of this.cart) {
      for (let prc of item.menu_prices) {
        this.total_price += prc.qty * prc.menu_price;
        this.carttotal += prc.qty;
      }
    }
  }

  goBack() {
    let ttl = "Anda ingin kembali?";
    let msg = "Perubahan data Anda tidak akan tersimpan.";

    console.log('lol')
    this.alert = this.alertCtrl.create({
      title: ttl,
      message: msg,
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }, {
          text: 'Ya',
          handler: () => {
            this.navCtrl.setRoot(SubsHomePage, { tabs: 1 });
          }
        }]
    });

    this.alert.present();
  }

  saveOrder() {
    let customer = this.user.get("customer", null);
    let loading = this.loadingCtrl.create({
      content: 'Saving ...'
    });
    loading.present();

    let menusave = [];
    for (let item of this.cart) {
      for (let prc of item.menu_prices) {
        if (prc.qty > 0) {
          menusave.push({ menu_id: prc.menu_id, qty: prc.qty, menu_price: prc.menu_price, portion: prc.portion });
        }
      }
    }
    let order_detail = { order_id: this.order_id, customer_id: customer.customer_id, customer_status: customer.customer_status, grandtotal: this.total_price, menus: menusave };

    this.http.post("http://api.blackgarlic.id:7005/app/order/edit/", order_detail).map(res => res.json()).subscribe(data => {
      this.events.publish("menu-update");
      loading.dismiss();
      this.navCtrl.pop();
    });
  }

  ionViewDidEnter() {
    this.initializeBackButtonCustomHandler();
  }

  ionViewWillLeave() {
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  public initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
      this.goBack();
    }, 10);
  }

}
