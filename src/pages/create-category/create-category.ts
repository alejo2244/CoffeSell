import { Component } from '@angular/core';
import { ServerProvider } from '../../providers/server/server';
import { ToastController, ViewController, NavController, NavParams } from 'ionic-angular';
import { CategoriesPage } from '../categories/categories';

/**
 * Generated class for the CreateCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-create-category',
  templateUrl: 'create-category.html',
})
export class CreateCategoryPage {

  category:any = {categoriesId: "", nameCategories:""};
  constructor(public navCtrl: NavController, 
              public provider: ServerProvider,
              public toastCtrl: ToastController,
              public viewCtrl: ViewController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateCategoryPage');
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }

  createCategory()
  {
    var category;
    this.provider.CreateCategory(this.category.categoriesId, this.category.nameCategories).then(res => {
      category = res;      
      if(category != undefined)
      {
        //user = res[0]; 
        
        const toast = this.toastCtrl.create({
          message: "Categoria Creada con Exito...",
          duration: 3000
        });
        toast.present();
        this.navCtrl.push(CategoriesPage);
      }
    });
  }
}
