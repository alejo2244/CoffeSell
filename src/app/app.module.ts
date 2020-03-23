import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { LogInPage }  from '../pages/log-in/log-in';
import { ProductPage }  from '../pages/product/product';
import { UsersPage }  from '../pages/users/users';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserDetailPage } from '../pages/user-detail/user-detail';
import { ProductDetailPage } from '../pages/product-detail/product-detail';
import { BranchsPage } from '../pages/branchs/branchs';
import { BranchDetailPage } from '../pages/branch-detail/branch-detail';
import { CreateUserPage } from '../pages/create-user/create-user';
import { OrdersPage } from '../pages/orders/orders';
import { OrderDetailPage } from '../pages/order-detail/order-detail';
import { OrderAdminPage } from '../pages/order-admin/order-admin';
import { InfoDevicePage }  from '../pages/info-device/info-device';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ServerProvider } from '../providers/server/server';
import { CategoriesPage } from '../pages/categories/categories';
import { CreateCategoryPage } from '../pages/create-category/create-category';
import { CategoryDetailPage } from '../pages/category-detail/category-detail';
import { CreateBranchPage } from '../pages/create-branch/create-branch';
import { CreateProductPage } from '../pages/create-product/create-product';

import { OneSignal } from '@ionic-native/onesignal/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LogInPage,
    ProductPage,
    UsersPage,
    CreateUserPage,
    UserDetailPage,
    ProductDetailPage,
    CreateProductPage,
    BranchsPage,
    BranchDetailPage,
    CreateBranchPage,
    OrdersPage,
    OrderDetailPage,
    OrderAdminPage,
    CategoriesPage,
    CreateCategoryPage,
    CategoryDetailPage,
    TabsPage,
    InfoDevicePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LogInPage,
    ProductPage,
    UsersPage,
    CreateUserPage,
    UserDetailPage,
    ProductDetailPage,
    CreateProductPage,
    BranchsPage,
    BranchDetailPage,
    CreateBranchPage,
    OrdersPage,
    OrderDetailPage,
    OrderAdminPage,
    CategoriesPage,
    CreateCategoryPage,
    CategoryDetailPage,
    TabsPage,
    InfoDevicePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ServerProvider,
    OneSignal,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
