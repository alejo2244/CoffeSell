import { Component } from '@angular/core';
import { ServerProvider } from '../../providers/server/server';
import { ToastController, NavController, NavParams } from 'ionic-angular';
import { BranchsPage } from '../branchs/branchs';

/**
 * Generated class for the CreateBranchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-create-branch',
  templateUrl: 'create-branch.html',
})
export class CreateBranchPage {

  branch:any = {branchId: 0, nameBranch: "", addressBranch:""};
  constructor(public toast: ToastController, 
              public provider: ServerProvider, 
              public navCtrl: NavController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateBranchPage');
  }

  createBranch()
  {
    var branch;
    this.provider.CreateBranch(this.branch.branchId ,this.branch.nameBranch, this.branch.addressBranch).then(res => {
      branch = res;      
      if(branch != undefined)
      {
        //user = res[0];
        const toast = this.toast.create({
          message: "Sucursal Creada con Exito...",
          duration: 3000
        });
        toast.present();
        this.navCtrl.push(BranchsPage);
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
