import { Component } from '@angular/core';
import { ToastController, NavController, ViewController } from 'ionic-angular';
import { ProductPage } from '../product/product';
import { LoadingController } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server';
import { BranchsPage } from '../branchs/branchs';
import { UsersPage } from '../users/users';
import { OrderAdminPage } from '../order-admin/order-admin';
import { CategoriesPage } from '../categories/categories';

/**
 * Generated class for the LogInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html',
})
export class LogInPage {

  indexCount:number = 0;
  src: any = "../../assests/imgs/Buttons/Login.png";
  session:boolean = false;
  user:any = {userName: "", password:""};
  constructor(public provider:ServerProvider,
              public toastCtrl: ToastController,
              private navCtrl: NavController,
              public toast: ToastController, 
              public viewCtrl: ViewController,
              public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogInPage');
    this.indexCount = ServerProvider.logIn;
    //this.indexCount = parseInt(localStorage.getItem("login") == null ? "0" : localStorage.getItem("login"));
  }
  
  LogIn(){
    
    const loader = this.loadingCtrl.create({
      content: "Validando Datos..."
    });
    loader.present();

    var user;
    this.provider.LogIn(this.user.userName, this.user.password).then(res => {
      
      console.log("res Login", res)
      user = res;      
      if(user != undefined)
      {
        user = res[0]; 
        if(user.enabled)
        {
          ServerProvider.logIn = 1;
          ServerProvider.userId = user._id;
          if(this.session)
          {
            console.log("ServerProvider.userId: " + ServerProvider.userId);
            this.provider.createSession(ServerProvider.oneSignalId, user._id, user.rol, user.branchId);
          }

          this.indexCount = 1;
          loader.dismiss();
          this.navCtrl.push(LogInPage);
        }
        else{
          const toast = this.toast.create({
            message: JSON.stringify(user),
            duration: 3000
          });
          toast.present();
          loader.dismiss();
          ServerProvider.logIn = 0;
        }
      }
      else{
        const toast = this.toast.create({
          message: "Datos Incorrectos...",
          duration: 3000
        });
        toast.present();
        loader.dismiss();
      }

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

  
  RedirectProduct(){
    this.navCtrl.push(ProductPage);
  }

  RedirectUsers(){
    this.navCtrl.push(UsersPage);
  }

  RedirectBranchs(){
    this.navCtrl.push(BranchsPage);
  }

  RedirectOrders(){
    this.navCtrl.push(OrderAdminPage);
  }
  
  RedirectCategories(){
    this.navCtrl.push(CategoriesPage);
  }

  LogOut(){
    const loader = this.loadingCtrl.create({
      content: "Cerrando Sesión..."
    });
    loader.present();
    setTimeout(() => {
      console.log("ServerProvider.userId: " + ServerProvider.userId);
      if(ServerProvider.userId != "0"){
        this.provider.deleteSession(ServerProvider.userId).then(res => {

          if(res.title == "SUCCESSFUL" || res.title == "SESSION_ERROR"){
            console.log("deleteSessionRes: " + JSON.stringify(res));
            ServerProvider.logIn = 0;
            this.indexCount = 0;
            window.location.reload();
          }
          else {
            loader.dismiss();
            const toast = this.toast.create({
              message: res.title + " " + res.description,
              duration: 3000
            });
            toast.present();
            console.log(res.title + " " + res.description);
          }
        });
      }
      else {
        ServerProvider.logIn = 0;
        this.indexCount = 0;
        window.location.reload();
      }
    }, 1000);
    
  }

  redirectHome(){
    const loader = this.loadingCtrl.create({
      content: "Redireccionando..."
    });
    loader.present();
    window.location.reload();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  hideShowPassword() {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
}
