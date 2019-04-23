import { Component, Injectable, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController, NavParams, ToastController, Navbar } from 'ionic-angular';
import { UserDetailPage } from '../user-detail/user-detail';
import { CreateUserPage } from '../create-user/create-user';
import { ServerProvider } from '../../providers/server/server';
import { LogInPage } from '../log-in/log-in';

/**
 * Generated class for the UsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
@Injectable()
export class UsersPage {
  
  @ViewChild(Navbar) navBar: Navbar;
  users: any[] = [];
  constructor(public provider:ServerProvider,
              public loadingCtrl: LoadingController, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public modalCtrl: ModalController, 
              public toast: ToastController,
              public alertCtrl: AlertController) {
    this.getUsers();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersPage');
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.navCtrl.push(LogInPage);
     }
  }

  getUsers(){
    
    const loader = this.loadingCtrl.create({
      content: "Cargando Usuarios..."
    });
    loader.present();

    this.provider.getUsers().then(res => {
      this.users = JSON.parse(JSON.stringify(res));
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
  
  itemSelected(user) {
    console.log("user-> " + JSON.stringify(user));
    const modal = this.modalCtrl.create(UserDetailPage, { UserData: user });
    modal.present();
  }

  addUser() {
    const modal = this.modalCtrl.create(CreateUserPage);
    modal.present();
  }

  deleteUser(user)
  {

    const confirm = this.alertCtrl.create({
      title: 'Eliminar?',
      message: 'Desea eliminar el usuario '+ user.userName + '?',
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
            this.provider.DeleteUser(user._id).then(res => {
              user = res;      
              if(user != undefined)
              {
                console.log(JSON.stringify(res));
              
                const toast = this.toast.create({
                  message: res.description,
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
        }
      ]
    });
    confirm.present();
  }
}
