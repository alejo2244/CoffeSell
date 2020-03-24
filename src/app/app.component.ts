import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { isCordovaAvailable } from '../common/is-cordova-available';

import { TabsPage } from '../pages/tabs/tabs';
import { ServerProvider } from '../providers/server/server';
import { InfoDevicePage } from '../pages/info-device/info-device';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  sender_id: string = "702026139940";
  oneSignalAppId: string = "d0435b6e-cf21-41b9-99ac-1664d6c187d6";
  
  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public provider: ServerProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      if (isCordovaAvailable()){
        window["plugins"].OneSignal.startInit(this.oneSignalAppId, this.sender_id);
        window["plugins"].OneSignal.inFocusDisplaying(window["plugins"].OneSignal.OSInFocusDisplayOption.Notification);
        window["plugins"].OneSignal.handleNotificationReceived(data => this.onPushReceived(data.payload));
        window["plugins"].OneSignal.handleNotificationOpened(data => this.onPushOpened(data.notification.payload));
        window["plugins"].OneSignal.endInit();
        window["plugins"].OneSignal.getIds(function(data){
          ServerProvider.oneSignalId = data.userId;
          provider.getInfoDevice(ServerProvider.oneSignalId).then(info => {
            if(info.status){
              InfoDevicePage.branch = info.data[0].branchId;
              provider.getBranchs().then(res => {
                let branchs = res;
                branchs.forEach(branch => {
                  if(branch.branchId == InfoDevicePage.branch){
                    InfoDevicePage.branchLabel = branch.nameBranch;
                  }
                });
              },
              error => {
                const toast = this.toast.create({
                  message: JSON.stringify(error),
                  duration: 3000
                });
                toast.present();
                console.log(error);
              });
              InfoDevicePage.board = info.data[0].board;
            }
          });
          provider.getSession(data.userId).then(res => {
            if(res.length > 0){
              ServerProvider.userId = res[0].userId;
              ServerProvider.logIn = 1;
            }
          });
        });
      }
    });
  }

  private onPushReceived(payload: OSNotificationPayload) {
    alert('Push recevied:' + payload.body);
    
  }
  
  private onPushOpened(payload: OSNotificationPayload) {
    alert('Push opened: ' + payload.body);
  }
}