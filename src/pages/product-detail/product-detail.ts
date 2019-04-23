import { Component } from '@angular/core';
import { ServerProvider } from '../../providers/server/server';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { ProductPage } from '../product/product';

/**
 * Generated class for the ProductDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {

  categories: any = [];
  product:any; 
  constructor(public toastCtrl: ToastController,
              public provider: ServerProvider, 
              public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController) {
    this.product = navParams.get("ProductData");
    this.getCategories();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getCategories(){
    this.provider.getCategories().then(res => {
      this.categories = JSON.parse(JSON.stringify(res));
    },
    error => {
      const toast = this.toastCtrl.create({
        message: JSON.stringify(error),
        duration: 3000
      });
      toast.present();
    });
  }
  
  saveProduct()
  {
    var product;
    this.provider.UpdateProduct(this.product).then(res => {
      product = res;      
      if(product != undefined)
      {
        product = res[0]; 
        const toast = this.toastCtrl.create({
          message: "Producto Actualizado con Exito...",
          duration: 3000
        });
        toast.present();
        this.navCtrl.push(ProductPage);
      }
    });

  }
}
