import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { isCordovaAvailable } from '../common/is-cordova-available';

import { TabsPage } from '../pages/tabs/tabs';
import { ServerProvider } from '../providers/server/server';

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
    public provider:ServerProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      if (isCordovaAvailable()){
        console.log("--------1---------");
        window["plugins"].OneSignal.startInit(this.oneSignalAppId, this.sender_id);
        console.log("--------2---------");
        window["plugins"].OneSignal.inFocusDisplaying(window["plugins"].OneSignal.OSInFocusDisplayOption.Notification);
        console.log("--------3---------");
        window["plugins"].OneSignal.handleNotificationReceived(data => this.onPushReceived(data.payload));
        console.log("--------4---------");
        window["plugins"].OneSignal.handleNotificationOpened(data => this.onPushOpened(data.notification.payload));
        console.log("--------5---------");
        window["plugins"].OneSignal.endInit();
        console.log("--------6---------");
        window["plugins"].OneSignal.getIds(function(data){
          ServerProvider.oneSignalId = data.userId;
            provider.getSession(data.userId).then(res => {
              console.log("res-->" + JSON.stringify(res));
              if(res.length > 0){
                console.log("res--->" + res[0].userId);
                ServerProvider.userId = res[0].userId;
                ServerProvider.logIn = 1;
                provider.getInfoDevice(res[0].oneSignalId).then(info => {
                  if(info.length > 0){
                    ServerProvider.branchID = info[0].branchId;
                    ServerProvider.board = info[0].table;
                  }
                });
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
