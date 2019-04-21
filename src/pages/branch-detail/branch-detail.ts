import { Component, ViewChild } from '@angular/core';
import { ViewController, NavController, NavParams, ToastController, Navbar } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server';
import { BranchsPage } from '../branchs/branchs';

/**
 * Generated class for the BranchDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-branch-detail',
  templateUrl: 'branch-detail.html',
})
export class BranchDetailPage {

  @ViewChild(Navbar) navBar: Navbar;
  branch:any; 
  constructor(public toastCtrl: ToastController, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public viewCtrl: ViewController,
              public provider: ServerProvider) {
    this.branch = navParams.get("BranchData");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BranchDetailPage');
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.navCtrl.push(BranchsPage);
     }
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  saveBranch()
  {
    var branch;
    this.provider.UpdateBranch(this.branch).then(res => {
      branch = res;      
      if(branch != undefined)
      {
        //user = res[0];
        const toast = this.toastCtrl.create({
          message: 'Sucursal ' + this.branch.nameBranch + ' Modificada con exito',
          duration: 3000
        });
        toast.present();
        this.navCtrl.push(BranchsPage);
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
}
