import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server';

/**
 * Generated class for the OrderAdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-admin',
  templateUrl: 'order-admin.html',
})
export class OrderAdminPage {

  branchSelect: any = "";
  branchs: any = [];
  orders: any[] = [];
  constructor(public provider: ServerProvider, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    this.orders = ServerProvider.orders;
    this.getBranchs();
    console.log(JSON.stringify(this.orders));
  }

  getBranchs(){
    this.provider.getBranchs().then(res => {
      this.branchs = JSON.parse(JSON.stringify(res));
      console.log(JSON.stringify(res));
    },
    error => {
      const toast = this.toastCtrl.create({
        message: JSON.stringify(error),
        duration: 3000
      });
      toast.present();
      console.log(error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderAdminPage');
  }

}
