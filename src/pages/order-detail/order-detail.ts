import { Component } from '@angular/core';
import { ViewController, LoadingController, NavController, NavParams, AlertController, ToastController, ModalController } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server';
import { InfoDevicePage } from '../info-device/info-device';


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
  public branchLabel: string;
  public board: number;
  branchs: any = [];
  status: string = "SIN ENVIAR";
  orderId: string = "";
  textButton: string = "ACEPTAR PEDIDO";
  hasOrder: boolean;
  enabledButton: boolean = true;
  products: any [] = [];
  total: number = 0;
  constructor(public toast: ToastController, public modalCtrl:ModalController, public alertCtrl:AlertController, public provider: ServerProvider, public viewCtrl:ViewController, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.products = OrderDetailPage.order;
    console.log("order -> " + OrderDetailPage.order.length);
    this.loadInfoDevice();
  }

  loadInfoDevice(){
    this.provider.getBranchs().then(res => {
    let branchs = res;
    branchs.forEach(branch => {
      if(branch.branchId == InfoDevicePage.branch){
        InfoDevicePage.branchLabel = branch.nameBranch;
      }
    });
  },
  error => {
    const toast = this.toast.create({
      message: JSON.stringify(error),
      duration: 3000
    });
    toast.present();
    console.log(error);
  });
    this.branchLabel = InfoDevicePage.branchLabel;
    this.board = InfoDevicePage.board;
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter OrderDetailPage');
    if(InfoDevicePage.branch == "0" && InfoDevicePage.board == "0"){
      const modal = this.modalCtrl.create(InfoDevicePage);
      modal.onDidDismiss(() => {
        this.loadInit();
      });
      modal.present();
    }
    else{
      this.loadInit();
    }    
  }

  loadInit(){
    this.loadInfoDevice();
    this.products = OrderDetailPage.order;
    var tmp = 0;
    this.products.forEach (function(numero){
      tmp += numero.price * numero.quantity;
    });
    this.total = tmp;
    if(this.total == 0){
      this.enabledButton = false;
    }
    else{
      this.enabledButton = true;
      this.cargarOrden();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
    this.cargarOrden();
  }

  SendOrder()
  {
    const loader = this.loadingCtrl.create({
      content: "Creando Orden..."
    });
    loader.present();
    if(InfoDevicePage.branch == "0" || InfoDevicePage.board == "0"){
      const alert = this.alertCtrl.create({
        title: 'Atención!',
        subTitle: "Por favor asigne sucursal y mesa para el dispositivo",
        buttons: ['Cerrar']
      });
      alert.present();
    }
    else{
      if(this.orderId != ""){
        this.provider.UpdateProductsOrder(this.orderId, this.products).then(data=>{
          if(data.status){
            this.cargarOrden();
          }
        });
      }
      else{
        var orderData = { status: "PENDIENTE", board: InfoDevicePage.board, branchId: InfoDevicePage.branch, products: this.products};
        console.log(JSON.stringify(orderData));
        this.provider.CreateOrder(orderData).then(res => {
          console.log(res);
          if(res.status == 200){
            this.provider.getSessionByBranch(InfoDevicePage.branch).then(ret => {
              var oneSignalIds = ret.data;
              var message = "Se creo un pedido para la sucursal: " + InfoDevicePage.branchLabel + " y para la mesa: " + InfoDevicePage.board;
              this.provider.CreateNotification("Se creo pedido!!", message, oneSignalIds).then(res => {
                const toast = this.toast.create({
                  message: "NotifEnviadas: " + JSON.parse(JSON.stringify(res)).recipients,
                  duration: 3000,
                  position: "top"
                });
                toast.present();
                loader.dismiss();
              },
              error => {
                const toast = this.toast.create({
                  message: JSON.stringify(error),
                  duration: 3000
                });
                toast.present();
              }); 

            });

            this.cargarOrden();
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
    }
  }
  
  getUrl(icon: string): string {
    if(!icon.includes("http")){
      icon = "http://drive.google.com/uc?export=view&id=13mI1CRvjjEG4kTwhazMlDiKbPZA2BwnL";
    }
    return icon;
  }

  add(product){
    if(!this.enabledButton){
      return;
    }
    console.log(product);
    var rem = this.products.find(prod => prod.name == product.name);
    rem.quantity = parseInt(rem.quantity) + 1;
    var tmp = 0;
    this.products.forEach (function(numero){
      tmp += numero.price * numero.quantity;
    });
    this.total = tmp;
  }

  remove(product){
    if(!this.enabledButton){
      return;
    }
    console.log(product);
    var rem = this.products.find(prod => prod.name == product.name);
    rem.quantity = rem.quantity - 1;
    var tmp = 0;
    this.products.forEach (function(numero){
      tmp += numero.price * numero.quantity;
    });
    this.total = tmp;
    if(rem.quantity == 0){
      this.deleteByName(rem.name);
    }
  }

  private deleteByName(name){
    
    if(this.products.length == 1){
      OrderDetailPage.order = [];
      this.products = [];
      this.total = 0;
      this.enabledButton = false;
    }
    else{
      var temp = [];
      for(let v in this.products){
        if(this.products[v].name != name){
          temp.push(this.products[v]);
        }
      }
      this.products = temp;
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
              if(res.status){
                const toast = this.toast.create({
                  message: "Orden eliminada.",
                  duration: 3000,
                  position: "top"
                });
                toast.present();
                this.products = [];
                OrderDetailPage.order = [];
                this.enabledButton = false;
                this.status = "SIN ENVIAR";
                this.textButton = "ACEPTAR PEDIDO";
                this.orderId = "";
                this.total = 0;
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
        }
      ]
    });
    confirm.present();
  }
  private cargarOrden(){
    this.limpiarDatos();
    console.log("CargarOrden");
    this.provider.getOrdersByStatus(InfoDevicePage.branch, InfoDevicePage.board, "PENDIENTE").then(resPend=>{
      console.log(resPend);
      if(resPend.length > 0){
        console.log(resPend[0]);
        this.textButton = "ACTUALIZAR PEDIDO";
        this.status = resPend[0].status;
        this.orderId = resPend[0].orderId;
        OrderDetailPage.order = resPend[0].products;
        this.products = resPend[0].products;
        var tmp = 0;
        OrderDetailPage.order.forEach (function(numero){
          tmp += numero.price * numero.quantity;
        });
        this.total = tmp;
        this.enabledButton = true;
      }
      else{
        this.orderId = "";
        this.provider.getOrdersByStatus(InfoDevicePage.branch, InfoDevicePage.board, "EN PROCESO").then(resProc=>{
          if(resProc.length > 0){
            console.log(resProc[0]);
            this.enabledButton = false;
            this.status = resProc[0].status;
            this.orderId = resProc[0].orderId;
            OrderDetailPage.order = resProc[0].products;
            this.products = resProc[0].products;
            var tmp = 0;
            OrderDetailPage.order.forEach (function(numero){
              tmp += numero.price * numero.quantity;
            });
            this.total = tmp;
            this.enabledButton = false;
          }
          else{
            this.orderId = "";
            if(this.products.length > 0){
              return;
            }
            OrderDetailPage.order = [];
            this.enabledButton = false;
          }
        });
      }
    });
  }
  
  private limpiarDatos(){
    if(this.products.length > 0){
      return;
    }
    this.products = [];
    OrderDetailPage.order = [];
    this.enabledButton = false;
    this.status = "SIN ENVIAR";
    this.textButton = "ACEPTAR PEDIDO";
  }

  updateInfoDevice(){
    if(InfoDevicePage.branch == "0" || InfoDevicePage.board == "0"){
      const modal = this.modalCtrl.create(InfoDevicePage);
      modal.onDidDismiss(() => {
        this.loadInfoDevice();
      });
      modal.present();
    }
    else{
      const prompt = this.alertCtrl.create({
        title: 'Clave',
        message: "Digite la clave para cambiar opciones:",
        inputs: [
          {
            name: 'clave',
            placeholder: '******',
            type: "password"
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Aceptar',
            handler: data => {
              if(data.clave != "" && data.clave == "123"){
                const modal = this.modalCtrl.create(InfoDevicePage);
                modal.onDidDismiss(() => {
                  this.loadInfoDevice();
                });
                modal.present();
              }
              else{
                const toast = this.toast.create({
                  message: "Error clave errada",
                  duration: 3000
                });
                toast.present();
              }
            }
          }
        ]
      });
      prompt.present();
    }
  }
}
