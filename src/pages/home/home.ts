import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 indexCount:number = 1;
  constructor(public navCtrl: NavController) {
    this.indexCount = ServerProvider.logIn;
  }

}
