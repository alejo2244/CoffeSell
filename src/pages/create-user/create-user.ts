import { Component } from '@angular/core';
import { ServerProvider } from '../../providers/server/server';
import { ToastController, ViewController, NavController, NavParams } from 'ionic-angular';
import { UsersPage } from '../users/users';

/**
 * Generated class for the CreateUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-create-user',
  templateUrl: 'create-user.html',
})
export class CreateUserPage {

  user:any = {userName: "", password:"", rol:""};
  branchs: any = [];
  roles: any = [];
  constructor(public provider:ServerProvider,
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public toast: ToastController, 
              public viewCtrl: ViewController) {
    this.getRoles();
    this.getBranchs();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateUserPage');
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

  createUser()
  {
    var user;
    this.provider.CreateUser(this.user).then(res => {
      user = res;      
      if(user != undefined)
      {
        //user = res[0]; 
        
        const toast = this.toast.create({
          message: "Usuario Creado con Exito...",
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
  }

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  hideShowPassword() {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
}
