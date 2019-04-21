import { Component, ViewChild } from '@angular/core';
import { AlertController, LoadingController, Navbar, ToastController, ModalController, NavController, NavParams } from 'ionic-angular';
import { ProductDetailPage } from '../product-detail/product-detail';
import { ServerProvider } from '../../providers/server/server';
import { CreateProductPage } from '../create-product/create-product';
import { LogInPage } from '../log-in/log-in';

/**
 * Generated class for the ProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {

  @ViewChild(Navbar) navBar: Navbar;
  groupProducts: any[] = [];
  constructor(public provider:ServerProvider,
              public navCtrl: NavController,
              public loadingCtrl: LoadingController, 
              public navParams: NavParams, 
              public toast: ToastController, 
              public modalCtrl: ModalController,
              public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');
    this.getProducts();
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.navCtrl.push(LogInPage);
     }
  }

  getProducts()
  {
    const loader = this.loadingCtrl.create({
      content: "Cargando Productos..."
    });
    loader.present();

    this.provider.getProducts().then(res => {
      console.log("Products->");
      console.log(JSON.stringify(res));
      this.groupProducts = JSON.parse(JSON.stringify(res));
      loader.dismiss();
    },
    error => {
      const toast = this.toast.create({
        message: JSON.stringify(error),
        duration: 3000
      });
      toast.present();
      loader.dismiss();
      console.log(error);
    });
  }

  itemSelected(product)
  {
    const modal = this.modalCtrl.create(ProductDetailPage, { ProductData: product } );
    modal.present();
  }

  addProduct()
  {
    const modal = this.modalCtrl.create(CreateProductPage);
    modal.present();
  }

  
  deleteProduct(product)
  {

    const confirm = this.alertCtrl.create({
      title: 'Eliminar?',
      message: 'Desea eliminar el producto '+ product.name + '?',
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
            this.provider.DeleteProduct(product.productId).then(res => {
              product = res;      
              if(product != undefined)
              {
                product = res[0];              
                console.log(JSON.stringify(product));
              
                const toast = this.toast.create({
                  message: "Producto Eliminado con Exito...",
                  duration: 3000
                });
                toast.present();
                this.navCtrl.push(ProductPage);
              }
            });
          }
        }
      ]
    });
    confirm.present();
  }
}
