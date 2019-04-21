import { Component } from '@angular/core';
import { ServerProvider } from '../../providers/server/server';
import { ToastController, ViewController, NavController, NavParams } from 'ionic-angular';
import { ProductPage } from '../product/product';

/**
 * Generated class for the CreateProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-create-product',
  templateUrl: 'create-product.html',
})
export class CreateProductPage {

  categories: any = [];
  product:any = { productId: "", name: "", description:"", quantity:"0", url:"", category: "" }; 
  constructor(public navCtrl: NavController, 
              public viewCtrl: ViewController,
              public provider: ServerProvider,
              public toastCtrl: ToastController,
              public navParams: NavParams) {
    this.getCategories();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateProductPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  createProduct()
  {
    var product;
    console.log(JSON.stringify(this.product));
    this.provider.CreateProduct(this.product).then(res => {
      product = res;      
      if(product != undefined)
      {
        //user = res[0]; 
        
        const toast = this.toastCtrl.create({
          message: "Producto Creado con Exito...",
          duration: 3000
        });
        toast.present();
        this.navCtrl.push(ProductPage);
      }
    },
    error => {
      const toast = this.toastCtrl.create({
        message: JSON.parse(error).error.description,
        duration: 3000
      });
      toast.present();
    });
  }
  
  getCategories(){
    this.provider.getCategories().then(res => {
      this.categories = JSON.parse(JSON.stringify(res));
      console.log(JSON.stringify(res));
    },
    error => {
      const toast = this.toastCtrl.create({
        message: JSON.parse(error).error.description,
        duration: 3000
      });
      toast.present();
    });
  }

}
