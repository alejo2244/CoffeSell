import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server';

/**
 * Generated class for the OrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {

  public static order: any [] = [];
  orders: any [] = [];
  constructor(public toast: ToastController, public alertCtrl:AlertController, public provider: ServerProvider, public viewCtrl:ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.orders = OrderDetailPage.order;
    console.log("order -> " + OrderDetailPage.order.length);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
  }

  SendOrder()
  {
    var orderData = {};
    ServerProvider.orders.push({ id:"Pedido", products : OrderDetailPage.order });

    this.provider.CreateOrder(orderData).then(res => { 

      OrderDetailPage.order = [];    
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
      const alert = this.alertCtrl.create({
        title: 'Correcto!',
        subTitle: 'Su pedido ha sido enviado',
        buttons: ['Cerrar']
      });
      alert.present();
      
      },
      error => {
        const toast = this.toast.create({
          message: JSON.parse(error).error.description,
          duration: 3000
        });
        toast.present();
      });

  }
}
