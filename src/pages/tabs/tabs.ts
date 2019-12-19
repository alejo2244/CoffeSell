import { Component } from '@angular/core';
import { OrdersPage } from '../orders/orders';
import { OrderDetailPage } from '../order-detail/order-detail';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  

  tab1Root = OrdersPage;
  tab2Root = OrderDetailPage;

  constructor() {
  }
}
