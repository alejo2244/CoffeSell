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
  public branchId: number;
  public board: number;
  status: string = "PENDIENTE - SIN ENVIAR";
  orderId: string = "";
  textButton: string = "ACEPTAR PEDIDO";
  hasOrder: boolean;
  enabledButton: boolean = true;
  orders: any [] = [];
  total: number = 0;
  constructor(public toast: ToastController, public alertCtrl:AlertController, public provider: ServerProvider, public viewCtrl:ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.orders = OrderDetailPage.order;
    console.log("order -> " + OrderDetailPage.order.length);
    this.branchId = ServerProvider.branchID;
    this.board = ServerProvider.board;
  }

  ionViewWillEnter() {
    this.orders = OrderDetailPage.order;
    var tmp = 0;
    this.orders.forEach (function(numero){
      tmp += numero.price * numero.quantity;
    });
    this.total = tmp;
    if(this.total == 0){
      this.enabledButton = false;
    }
    else{
      this.enabledButton = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
    this.provider.getOrdersByStatus(ServerProvider.branchID, ServerProvider.board, "PENDIENTE").then(resPend=>{
      console.log(resPend);
      if(resPend.length > 0){
        console.log(resPend[0]);
        this.textButton = "ACTUALIZAR PEDIDO";
        this.status = resPend[0].status;
        this.orderId = resPend[0].orderId;
        resPend[0].products.forEach(product => {
          OrderDetailPage.order.push(product);
          this.orders = OrderDetailPage.order;
          var tmp = 0;
          this.orders.forEach (function(numero){
            tmp += numero.price * numero.quantity;
          });
          this.total = tmp;
        });        
        this.enabledButton = true;
      }
      else{
        this.provider.getOrdersByStatus(ServerProvider.branchID, ServerProvider.board, "EN PROCESO").then(resProc=>{
          if(resProc.length > 0){
            console.log(resProc);
            this.textButton = "ACTUALIZAR PEDIDO";
            this.status = resPend[0].status;
            this.orderId = resPend[0].orderId;
            resPend[0].products.forEach(product => {
              OrderDetailPage.order.push(product);
              this.orders = OrderDetailPage.order;
              var tmp = 0;
              this.orders.forEach (function(numero){
                tmp += numero.price * numero.quantity;
              });
              this.total = tmp;
            });
            this.enabledButton = true;
          }
          else{
            OrderDetailPage.order = [];
            this.enabledButton = true;
          }
        });
      }
    });
  }

  SendOrder()
  {
    var orderData = { status: "PENDIENTE", board: ServerProvider.board, branchId: ServerProvider.branchID, products: this.orders};
    console.log(JSON.stringify(orderData));
    this.provider.CreateOrder(orderData).then(res => {
      console.log(res);
      if(res.status == 200){
        OrderDetailPage.order = [];    
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
        this.provider.getOrdersByStatus(ServerProvider.branchID, ServerProvider.board, "PENDIENTE").then(resPend=>{
          if(resPend.length > 0){
            OrderDetailPage.order.push(resPend[0]);
          }
          else{
            this.provider.getOrdersByStatus(ServerProvider.branchID, ServerProvider.board, "EN PROCESO").then(resProc=>{
              if(resProc.length > 0){
                OrderDetailPage.order.push(resProc[0]);
              }
              else{
                OrderDetailPage.order = [];
              }
            });
          }
        });
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
      this.enabledButton = false;
    }
    else{
      var temp = [];
      for(let v in this.orders){
        if(this.orders[v].name != name){
          temp.push(this.orders[v]);
        }
      }
      this.orders = temp;
      this.enabledButton = true;
      OrderDetailPage.order = temp;
    }
  }
  
  deleteOrder(){
    const confirm = this.alertCtrl.create({
      title: 'Eliminar?',
      message: '¿En realidad desea eliminar el pedido en curso?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.provider.DeleteOrder(this.orderId).then(res => {
              
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
      ]
    });
    confirm.present();
  }

}
