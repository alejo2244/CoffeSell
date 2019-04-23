import { Component, ViewChild } from '@angular/core';
import { ServerProvider } from '../../providers/server/server';
import { ToastController, NavController, NavParams, ViewController, Navbar } from 'ionic-angular';
import { UsersPage } from '../users/users';

/**
 * Generated class for the UserDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-detail',
  templateUrl: 'user-detail.html',
})
export class UserDetailPage {
  
  @ViewChild(Navbar) navBar: Navbar;
  user:any; 
  branchs: any = [];
  roles: any = [];
  constructor(public provider: ServerProvider,
              public toastCtrl: ToastController, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public toast: ToastController, 
              public viewCtrl: ViewController) {
    this.user = navParams.get("UserData");
    this.getRoles();
    this.getBranchs();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserDetailPage');
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.navCtrl.push(UsersPage);
     }
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  getRoles(){
    this.provider.getRoles().then(res => {
      this.roles = JSON.parse(JSON.stringify(res));
      console.log("roles-> " + JSON.stringify(res));
    },
    error => {
      const toast = this.toast.create({
        message: JSON.parse(error).error.description,
        duration: 3000
      });
      toast.present();
    });
  }

  getBranchs(){
    this.provider.getBranchs().then(res => {
      this.branchs = JSON.parse(JSON.stringify(res));
      console.log("branchs-> " + JSON.stringify(res));
    },
    error => {
      const toast = this.toast.create({
        message: JSON.parse(error).error.description,
        duration: 3000
      });
      toast.present();
    });
  }

  saveUser()
  {
    var user;
    console.log("user mod-> " + JSON.stringify(this.user));
    this.provider.UpdateUser(this.user, this.user._id).then(res => {
    user = res;      
    if(user != undefined)
    {
        user = res[0]; 
       
        console.log(JSON.stringify(user));

        const toast = this.toast.create({
          message: "Usuario Actualizado con Exito...",
          duration: 3000
        });
        toast.present();
        this.navCtrl.push(UsersPage);
      }
    },
    error => {
      const toast = this.toast.create({
        message: JSON.parse(error).error.description,
        duration: 3000
      });
      toast.present();
    });

    const toast = this.toastCtrl.create({
      message: 'Usuario ' + this.user.userName + ' Modificado con exito',
      duration: 3000
    });
    toast.present();
  }

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  hideShowPassword() {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
}

