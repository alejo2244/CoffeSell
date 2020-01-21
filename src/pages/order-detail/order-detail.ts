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
  public static brachId: number;
  public static board: number;
  orders: any [] = [];
  total: number = 0;
  constructor(public toast: ToastController, public alertCtrl:AlertController, public provider: ServerProvider, public viewCtrl:ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.orders = OrderDetailPage.order;
    console.log("order -> " + OrderDetailPage.order.length);
  }

  ionViewWillEnter() {
    this.orders = OrderDetailPage.order;
    var tmp = 0;
    this.orders.forEach (function(numero){
      tmp += numero.price * numero.quantity;
    });
    this.total = tmp;
    if(this.total == 0){
      const alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'Agregue productos al pedido',
        buttons: [ {text: 'Cerrar',
        handler: data => {
          setTimeout(function(){}, 2000);
          location.reload();
        }}]
      });
      alert.present();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
    if(OrderDetailPage.order.length == 0){
      const alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'Agregue productos al pedido',
        buttons: [ {text: 'Cerrar',
        handler: data => {
          location.reload();
        }}]
      });
      alert.present();
    }
  }

  SendOrder()
  {
    var orderData = { board: ServerProvider.board, branchId: ServerProvider.branchID, products: this.orders};
    console.log(JSON.stringify(orderData));
    this.provider.CreateOrder(orderData).then(res => {
      console.log(res);
      if(res.status == 200){
        OrderDetailPage.order = [];    
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
        const alert = this.alertCtrl.create({
          title: 'Correcto!',
          subTitle: res.description,
          buttons: ['Cerrar']
        });
        alert.present();
      }
      else{
        const alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: res.description,
          buttons: ['Cerrar']
        });
        alert.present();
      }
      
      },
      error => {
        const toast = this.toast.create({
          message: JSON.parse(error).error.description,
          duration: 3000
        });
        toast.present();
      });

  }
  
  getUrl(icon: string): string {
    if(!icon.includes("http")){
      icon = "http://drive.google.com/uc?export=view&id=13mI1CRvjjEG4kTwhazMlDiKbPZA2BwnL";
    }
    return icon;
  }

  add(product){
    console.log(product);
    var rem = this.orders.find(prod => prod.name == product.name);
    rem.quantity = parseInt(rem.quantity) + 1;
    var tmp = 0;
    this.orders.forEach (function(numero){
      tmp += numero.price * numero.quantity;
    });
    this.total = tmp;
  }

  remove(product){
    console.log(product);
    var rem = this.orders.find(prod => prod.name == product.name);
    rem.quantity = rem.quantity - 1;
    var tmp = 0;
    this.orders.forEach (function(numero){
      tmp += numero.price * numero.quantity;
    });
    this.total = tmp;
    if(rem.quantity == 0){
      this.deleteByName(rem.name);
    }
  }

  private deleteByName(name){
    
    if(this.orders.length == 1){
      OrderDetailPage.order = [];
      this.orders = [];
      this.total = 0;
      const alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'Agregue productos al pedido',
        buttons: [ {text: 'Cerrar',
        handler: data => {
          location.reload();
        }}]
      });
      alert.present();
    }
    else{
      var temp = [];
      for(let v in this.orders){
        if(this.orders[v].name != name){
          temp.push(this.orders[v]);
        }
      }
      this.orders = temp;
      OrderDetailPage.order = temp;
    }
  }
}
