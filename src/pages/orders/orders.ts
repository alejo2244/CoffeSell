import { Component } from '@angular/core';
import { LoadingController, ModalController, AlertController, NavController, NavParams, ToastController } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server';
import { OrderDetailPage } from '../order-detail/order-detail';
import { LogInPage } from '../log-in/log-in';

/**
 * Generated class for the OrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {

  groupProducts: any[] = [];
  constructor(public modalCtrl:ModalController,
              public provider: ServerProvider,
              public alertCtrl: AlertController, 
              public navCtrl: NavController,
              public loadingCtrl: LoadingController, 
              public toast: ToastController,
              public navParams: NavParams) {
                
    this.getProducts();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');

  //   window["plugins"].gdrive.fileList(
  //     function(res){
  //       //the files are under res.flist;
  //     console.log(res);
  //     },
  //     function(err){
  //     console.log(err);
  //     }
  //  );
  }

  getProducts(){
    
    const loader = this.loadingCtrl.create({
      content: "Cargando Productos..."
    });
    loader.present();

    this.provider.getProducts().then(res => {
      console.log("Products->");
      console.log(JSON.stringify(res));
      loader.dismiss();
      this.groupProducts = JSON.parse(JSON.stringify(res));
    },
    error => {
      const toast = this.toast.create({
        message: JSON.parse(error).error.description,
        duration: 3000
      });
      toast.present();
      loader.dismiss();
    });
  }

  add(product)
  {
    var ord = { name: product.name, quantity: 1 , url: product.url};
    OrderDetailPage.order.push(ord);
    
    const toast = this.toast.create({
      message: product.name + " agregado al pedido...",
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  getUrl(icon: string): string {
      return icon;
  }

  itemSelected(product)
  {
      const prompt = this.alertCtrl.create({
        title: 'Agregar ' + product.name,
        message: "Cuantos " + product.name + " quiere agregar al pedido?",
        inputs: [
          {
            name: 'Cantidad',
            placeholder: 'Cantidad',
            type: "number",
            min: 1
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
            text: 'Guardar',
            handler: data => {
              console.log('Saved clicked' + JSON.stringify(data));
              var ord = { name: product.name, quantity: data.Cantidad , url: product.url};
              OrderDetailPage.order.push(ord);
            }
          }
        ]
      });
      prompt.present();
  }

  LogIn()
  {
    const modal = this.modalCtrl.create(LogInPage);
    modal.present();
  }
  
  notification()
  {
      const prompt = this.alertCtrl.create({
        title: 'Notificacion',
        message: "Cuantos quiere agregar al pedido?",
        inputs: [
          {
            name: 'Titulo',
            placeholder: 'Titulo',
            type: "text"
          },
          {
            name: 'Mensaje',
            placeholder: 'Mensaje',
            type: "text"
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Guardar',
            handler: data => {
              this.provider.CreateNotification(data.Titulo, data.Mensaje).then(res => {
                const toast = this.toast.create({
                  message: "NotifEnviadas: " + JSON.parse(JSON.stringify(res)).recipients,
                  duration: 3000,
                  position: "top"
                });
                toast.present();
              },
              error => {
                const toast = this.toast.create({
                  message: JSON.stringify(error),
                  duration: 3000
                });
                toast.present();
              });              
            }
          }
        ]
      });
      prompt.present();
  }
}
