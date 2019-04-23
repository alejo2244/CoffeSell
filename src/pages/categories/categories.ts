import { Component, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController, NavParams, ToastController, Navbar } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server';
import { CategoryDetailPage } from '../category-detail/category-detail';
import { CreateCategoryPage } from '../create-category/create-category';
import { LogInPage } from '../log-in/log-in';

/**
 * Generated class for the CategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  @ViewChild(Navbar) navBar: Navbar;
  categories: any[] = [];
  constructor(public provider:ServerProvider,
    public loadingCtrl: LoadingController, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public modalCtrl: ModalController, 
    public toast: ToastController,
    public alertCtrl: AlertController) {
    this.getCategories();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.navCtrl.push(LogInPage);
     }
  }

  getCategories()
  {
    const loader = this.loadingCtrl.create({
      content: "Cargando Categorias de Producto..."
    });
    loader.present();

    this.provider.getCategories().then(res => {
      this.categories = JSON.parse(JSON.stringify(res));
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

  itemSelected(category) {
    console.log("user-> " + JSON.stringify(category));
    const modal = this.modalCtrl.create(CategoryDetailPage, { CategoryData: category });
    modal.present();
  }
  
  addCategory() {
    const modal = this.modalCtrl.create(CreateCategoryPage);
    modal.present();
  }

  deleteCategory(category)
  {

    const confirm = this.alertCtrl.create({
      title: 'Eliminar?',
      message: 'Desea eliminar la categoria '+ category.nameCategories + '?',
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
            this.provider.DeleteCategory(category._id).then(res => {
              category = res;      
              if(category != undefined)
              {
                category = res[0];              
                console.log(JSON.stringify(category));
              
                const toast = this.toast.create({
                  message: "Categoria Eliminada con Exito...",
                  duration: 3000
                });
                toast.present();
                this.navCtrl.push(CategoriesPage);
              }
            });
          }
        }
      ]
    });
    confirm.present();
  }

}
