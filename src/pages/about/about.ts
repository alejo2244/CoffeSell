import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {LogInPage} from '../log-in/log-in';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController) {

  }

  ShowView(){
    this.navCtrl.push(LogInPage);

  }

}
