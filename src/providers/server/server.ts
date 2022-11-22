//ionic cordova run android --target="Pixel_2_API_30"

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the ServerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServerProvider {

  public static logIn: any = 0;
  public static oneSignalId: any = "0";
  public static userId: any = "0";
  private static urlService: string = "http://192.168.0.18:8081/app/";
  //private static urlService: string = "https://coffeesell.herokuapp.com/app/";
  constructor(public http: HttpClient) {
    console.log('Hello ServerProvider Provider');
  }

  executeService(method, service, parameters, id){
    let promise;
    switch(method)
    {
      case "get":
      promise = new Promise((resolve, reject) => { this.http.get(ServerProvider.urlService + service).subscribe(data => { resolve(data); }, err => { reject(JSON.stringify(err)); }); });
      break;
      case "post":
      promise = new Promise((resolve, reject) => { this.http.post(ServerProvider.urlService  + service, parameters).subscribe(data => { resolve(data); }, err => { reject(JSON.stringify(err)); }); });
      break;
      case "patch":
      promise = new Promise((resolve, reject) => { this.http.patch(ServerProvider.urlService  + service + "/" + id, parameters).subscribe(data => { resolve(data); }, err => { reject(JSON.stringify(err)); }); });
      break;
      case "delete":
      promise = new Promise((resolve, reject) => { this.http.delete(ServerProvider.urlService  + service + "/" + id).subscribe(data => { resolve(data); }, err => { reject(JSON.stringify(err)); }); });
      break;
      case "getP":
      promise = new Promise((resolve, reject) => { this.http.get(ServerProvider.urlService  + service + "/" + id).subscribe(data => { resolve(data); }, err => { reject(JSON.stringify(err)); }); });
      break;
      case "getWithP":
      promise = new Promise((resolve, reject) => { this.http.get(ServerProvider.urlService  + service, {observe: parameters}).subscribe(data => { resolve(data); }, err => { reject(JSON.stringify(err)); }); });
      break;
    }
    return promise;
  }

  LogIn(username, password) {
    let parameters = {
      "userName": username,
      "password": password
    }
    return this.executeService("post", "login", parameters, 0);
  }

  createSession(oneSignalId, userId, rolId, branchId) {
    let parameters = {
      "oneSignalId": oneSignalId,
      "userId": userId,
      "rolId": rolId,
      "branchId": branchId
    }
    return this.executeService("post", "sessions", parameters, 0);
  }

  deleteSession(userId) {
    return this.executeService("delete", "sessions", null, userId);
  }

  getSession(userId) {
    return this.executeService("getP", "sessions", null, userId);
  }

  getSessionByBranch(branchId) {
    return this.executeService("getP", "sessionsbybranch", null, branchId);
  }

  getInfoDevice(oneSignalId) {
    return this.executeService("getP", "infoDevice", null, oneSignalId);
  }

  createInfoDevice(params) {
    return this.executeService("post", "infoDevice", params, null);
  }

  updateInfoDevice(params) {
    return this.executeService("patch", "infoDevice", params, params.oneSignalId);
  }

  getOrdersByStatus(branchId, board, status) {
    let parameters = {
      "branchId": branchId,
      "board": board,
      "status": status
    }
    console.log("parameters:" + JSON.stringify(parameters));
    return this.executeService("post", "ordersByStatus", parameters, null);
  }

  getOrdersByBranchAndBoard(branchId, board) {
    let parameters = {
      "branchId": branchId,
      "board": board
    }
    return this.executeService("getWithP", "ordersByBranchAndBoard", parameters, null);
  }
  

  getUsers() {
    return this.executeService("get", "users", null, 0);
  }
  
  CreateUser(userData) {
    let parameters = {
      "userName": userData.userName,
      "password": userData.password,
      "rol": userData.rol,
      "branchId": userData.branchId
    }
    return this.executeService("post", "users", parameters, 0);
  }

  UpdateUser(userData, id) {
    let parameters = {
      "userName": userData.userName,
      "password": userData.password,
      "rol": userData.rol,
      "branchId": userData.branchId
    }
    console.log("parameters->" + JSON.stringify(parameters) + "id-> " + id);
    return this.executeService("patch", "users", parameters, id);
  }

  DeleteUser(id) {
    return this.executeService("delete", "users", null, id);
  }

  getCategories() {
    return this.executeService("get", "categories", null, 0);
  }
  
  CreateCategory(id, name) {
    let parameters = {
      "categoriesId": id,
      "nameCategories": name
    }
    return this.executeService("post", "categories", parameters, 0);
  }

  UpdateCategory(_id, id, name) {
    let parameters = {
      "categoriesId": id,
      "nameCategories": name
    }
    return this.executeService("patch", "categories", parameters, _id);
  }

  DeleteCategory(_id) {
    return this.executeService("delete", "categories", null, _id);
  }

  getBranchs() {
    return this.executeService("get", "branchs", null, 0);
  }
  
  CreateBranch(id, name, address) {
    let parameters = {
      "branchId": id,
      "nameBranch": name,
      "addressBranch": address
    }
    return this.executeService("post", "branchs", parameters, 0);
  }

  UpdateBranch(branchData) {
    let parameters = {
      "branchId": branchData.branchId,
      "nameBranch": branchData.nameBranch,
      "addressBranch": branchData.addressBranch
    }
    return this.executeService("patch", "branchs", parameters, branchData._id);
  }

  DeleteBranch(_id) {
    return this.executeService("branchs", "delete", null, _id);
  }

  getProducts() {
    return this.executeService("get", "products", null, 0);
  }

  CreateProduct(productData) {
    let parameters = {
      "productId": productData.productId,
      "name": productData.name,
      "description": productData.description,
      "quantity": productData.quantity,
      "url": productData.url,
      "category": productData.category,
      "price": productData.price
    }
    return this.executeService("post", "products", parameters, 0);
  }  

  UpdateProduct(productData) {    
    let parameters = {
      "productId": productData.productId,
      "name": productData.name,
      "description": productData.description,
      "quantity": productData.quantity,
      "url": productData.url,
      "category": productData.categoriesId
    }
    return this.executeService("patch", "products", parameters, productData.productId);
  }

  DeleteProduct(_id) {
    return this.executeService("delete", "products", null, _id);
  }

  getOrderClient(board, branch) {
    return new Promise((resolve, reject) => { this.http.get("https://coffeesell.herokuapp.com/app/order/" + board + "," + branch).subscribe(data => { resolve(data); }, err => { reject(JSON.stringify(err)); }); });
  }

  getOrderEmployed(branch) {
    return new Promise((resolve, reject) => { this.http.get("https://coffeesell.herokuapp.com/app/order/" + branch).subscribe(data => { resolve(data); }, err => { reject(JSON.stringify(err)); }); });
  }

  getOrderAdmin() {
    return this.executeService("get", "orders", null, 0);
  }

  getOrdersByBranchId(body) {   
    return this.executeService("post", "ordersByBranch", body, null);
  }

  CreateOrder(orderData) {
    return this.executeService("post", "orders", orderData, 0);
  }

  UpdateStatusOrder(orderId, status) {    
    let parameters = {
      "status": status
    }
    return this.executeService("patch", "orderStatus", parameters, orderId);
  }

  UpdateProductsOrder(orderId, products) {
    return this.executeService("patch", "orderProducts", products, orderId);
  }

  DeleteOrder(_id) {
    return this.executeService("delete", "orders", null, _id);
  }  

  getRoles() {
    return this.executeService("get", "roles", null, 0);
  }


  //-------------------- NOTIFICACIONES -----------------------//
  
  CreateNotification(title, message, ids) {
    let parameters = {
      "app_id": "d0435b6e-cf21-41b9-99ac-1664d6c187d6",
      "include_player_ids": ids,
      "data": {"foo": "bar"},
      "headings" : { "en": title },
      "contents": {"en": message }
    }
    return new Promise((resolve, reject) => { this.http.post("https://onesignal.com/api/v1/notifications", parameters).subscribe(data => { resolve(data); }, err => { reject(JSON.stringify(err)); }); });      
  }

}
