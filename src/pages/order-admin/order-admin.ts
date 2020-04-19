import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server';
import { InfoDevicePage } from '../info-device/info-device';

/**
 * Generated class for the OrderAdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-admin',
  templateUrl: 'order-admin.html',
})
export class OrderAdminPage {

  branchSelect: any = "";
  branchs: any = [];
  orders: any[] = [];
  constructor(public provider: ServerProvider, public alertCtrl:AlertController, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    this.getOrdersByBranch(InfoDevicePage.branch);
    this.getBranchs();
    this.branchSelect = InfoDevicePage.branch;
  }

  getBranchs(){
    this.provider.getBranchs().then(res => {
      this.branchs = JSON.parse(JSON.stringify(res));
      console.log(JSON.stringify(res));
    },
    error => {
      const toast = this.toastCtrl.create({
        message: JSON.stringify(error),
        duration: 3000
      });
      toast.present();
      console.log(error);
    });
  }

  getOrdersByBranch(branch){
    var branchId = branch;
    var body = { "branchId" : branchId };
    this.provider.getOrdersByBranchId(body).then(res => {
      this.orders = [];
      if(res.status){
        this.orders = res.orders;
      }
      console.log("ORDENES");
      console.log(this.orders);
    },
    error => {
      const alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: JSON.parse(error).error.text,
        buttons: [ {text: 'Cerrar',
        handler: data => {
          setTimeout(function(){}, 2000);
          this.getOrdersByBranch("0");
          this.getBranchs();
        }}]
      });
      alert.present();
    });
  }
  
  getUrl(icon: string): string {
    if(!icon.includes("http")){
      icon = "http://drive.google.com/uc?export=view&id=13mI1CRvjjEG4kTwhazMlDiKbPZA2BwnL";
    }
    return icon;
  }

  loadTotal(ord){
    var tmp = 0;
    ord.products.forEach (function(numero){
      tmp += numero.price * numero.quantity;
    });
    return tmp;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderAdminPage');
  }

  getOrder(orderId){
    this.provider.UpdateStatusOrder(orderId, "EN PROCESO").then(data => {
      this.getOrdersByBranch(InfoDevicePage.branch);
    });
  }

  closeOrder(orderId){
    this.provider.UpdateStatusOrder(orderId, "ENTREGADA").then(data => {
      this.getOrdersByBranch(InfoDevicePage.branch);
    });
  }

}
