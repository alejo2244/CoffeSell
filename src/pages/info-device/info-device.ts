import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server';

/**
 * Generated class for the InfoDevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-info-device',
  templateUrl: 'info-device.html',
})
export class InfoDevicePage {

  public static branchLabel: any = "N/A";
  public static branch: any = "0";
  public static board: any = "0";
  branchs: any = [];
  branch: any = "0";
  board: any = "0";
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public provider: ServerProvider, 
              public toast: ToastController,
              public viewCtrl: ViewController) {
    this.branch = InfoDevicePage.branch;
    this.board = InfoDevicePage.board;
    this.getBranchs();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoDevicePage');
    this.branch = InfoDevicePage.branch;
    this.board = InfoDevicePage.board;
  }

  getBranchs(){
    console.log("getBranchs");
    this.provider.getBranchs().then(res => {
      this.branchs = res;
      console.log("Branchs");
      console.log(JSON.stringify(res));
    },
    error => {
      const toast = this.toast.create({
        message: JSON.stringify(error),
        duration: 3000
      });
      toast.present();
      console.log(error);
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  updateInfoDevice(){
    var body = {
      "oneSignalId": ServerProvider.oneSignalId,
      "board": this.board,
      "branchId": this.branch
    };
    console.log("body");
    console.log(body);
    if(InfoDevicePage.branch == "0" && InfoDevicePage.board == "0"){
      this.provider.createInfoDevice(body).then(data => {
        if(data.status){
          InfoDevicePage.branch = this.branch;
          InfoDevicePage.board = this.board;
          this.branchs.forEach(branch => {
            if(branch.branchId == InfoDevicePage.branch){
              InfoDevicePage.branchLabel = branch.nameBranch;
            }
          });
          this.viewCtrl.dismiss();
        }
        else{
          const toast = this.toast.create({
            message: data.description,
            duration: 3000
          });
          toast.present();
        }
      });
    }
    else{
      this.provider.updateInfoDevice(body).then(data => {
        if(data.status){
          InfoDevicePage.branch = this.branch;
          InfoDevicePage.board = this.board;
          this.branchs.forEach(branch => {
            if(branch.branchId == InfoDevicePage.branch){
              InfoDevicePage.branchLabel = branch.nameBranch;
            }
          });
          this.viewCtrl.dismiss();
        }
        else{
          const toast = this.toast.create({
            message: data.description,
            duration: 3000
          });
          toast.present();
        }
      });
    }
    
  }
}
