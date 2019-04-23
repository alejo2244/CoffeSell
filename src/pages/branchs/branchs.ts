import { Component, ViewChild } from '@angular/core';
import { ToastController, LoadingController, ModalController, NavController, NavParams, AlertController, Navbar } from 'ionic-angular';
import { BranchDetailPage } from '../branch-detail/branch-detail';
import { CreateBranchPage } from '../create-branch/create-branch';
import { ServerProvider } from '../../providers/server/server';
import { LogInPage } from '../log-in/log-in';

/**
 * Generated class for the BranchsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-branchs',
  templateUrl: 'branchs.html',
})
export class BranchsPage {
  
  @ViewChild(Navbar) navBar: Navbar;
  branchs: any[] = [];
  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,  
              public navParams: NavParams, 
              public provider: ServerProvider,
              public toast: ToastController,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BranchsPage');
    this.getBranchs();
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.navCtrl.push(LogInPage);
     }
  }

  getBranchs()
  {
    const loader = this.loadingCtrl.create({
      content: "Cargando Sucursales..."
    });
    loader.present();

    this.provider.getBranchs().then(res => {
      this.branchs = JSON.parse(JSON.stringify(res));
      loader.dismiss()
      console.log(JSON.stringify(res));
    },
    error => {
      const toast = this.toast.create({
        message: JSON.parse(error).error.description,
        duration: 3000
      });
      toast.present();
      loader.dismiss()
      console.log(error);
    });
  }
  
  itemSelected(branch)
  {
    console.log("branch-> " + JSON.stringify(branch));
    const modal = this.modalCtrl.create(BranchDetailPage,{ BranchData: branch } );
    modal.present();
  }
  
  addBranch() {
    const modal = this.modalCtrl.create(CreateBranchPage);
    modal.present();
  }
  
  deleteBranch(branch)
  {

    const confirm = this.alertCtrl.create({
      title: 'Eliminar?',
      message: 'Desea eliminar la sucursal '+ branch.nameBranch + '?',
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
            this.provider.DeleteBranch(branch._id).then(res => {
              console.log(JSON.stringify(res));
              
              const toast = this.toast.create({
                message: res.description,
                duration: 3000
              });
              toast.present();
              
              this.navCtrl.push(BranchsPage);
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
