import { Component, ViewChild } from '@angular/core';
import { ServerProvider } from '../../providers/server/server';
import { ToastController, NavController, NavParams, ViewController, Navbar } from 'ionic-angular';
import { CategoriesPage } from '../categories/categories';

/**
 * Generated class for the CategoryDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-category-detail',
  templateUrl: 'category-detail.html',
})
export class CategoryDetailPage {

  @ViewChild(Navbar) navBar: Navbar;
  category:any; 
  private id: number = 0;
  constructor(public provider: ServerProvider,
    public toastCtrl: ToastController, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public toast: ToastController, 
    public viewCtrl: ViewController) {
      this.category = navParams.get("CategoryData");
      this.id = this.category.categoriesId;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryDetailPage');
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.navCtrl.push(CategoriesPage);
     }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  saveCategory()
  {
    var category;
    this.provider.UpdateCategory(this.id, this.category.categoriesId, this.category.nameCategories).then(res => {
      category = res;      
      if(category != undefined)
      {
        category = res[0]; 
        
        console.log(JSON.stringify(category));

        const toast = this.toast.create({
          message: "Categoria Actualizada con Exito...",
          duration: 3000
        });
        toast.present();
        this.navCtrl.push(CategoriesPage);
      }
    });
  }
}
