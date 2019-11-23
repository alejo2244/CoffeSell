import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class DatabaseService {

  private database: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor(private platform:Platform, private SQLite: SQLite) { 
    this.platform.ready().then(()=>{
        SQLite.create({
          name: 'CoffeSell.db',
          location: 'default'
        })
        .then((db:SQLiteObject)=>{
          
          this.database = db;
          console.log("------- Crear BD ------");
          this.createTables().then(()=>{     
            //communicate we are ready!
            this.dbReady.next(true);
            console.log("------- dbReady ------");
          });
        }).catch((err)=>console.log("error detected creating db", err));
    });
  }

  private createTables(){
    return this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS session (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          rol TEXT,
          branchId INTEGER,
          playerId TEXT,
          userId TEXT
        );`
      ,[])
      .then(()=>{
        return this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS app (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          board INTEGER,
          branchId INTEGER
          );`,[] )
      }).catch((err)=>console.log("error detected creating tables", err));
   }
   
   private isReady(){
    return new Promise((resolve, reject) =>{
      //if dbReady is true, resolve
      if(this.dbReady.getValue()){
        resolve();
      }
      //otherwise, wait to resolve until dbReady returns true
      else{
        this.dbReady.subscribe((ready)=>{
          if(ready){ 
            resolve(); 
          }
        });
      }  
    })
  }

  getUserSessions(){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql("SELECT * from session", [])
      .then((data)=>{
        let lists = [];
        for(let i=0; i<data.rows.length; i++){
          lists.push(data.rows.item(i));
        }
        return lists;
      })
    })
  }

  addUserSession(rol, branchId, playerId, userId){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`INSERT INTO session(rol, branchId, playerId, userId) VALUES ('${rol}','${branchId}','${playerId}','${userId}');`
      , []).then((result)=>{
        if(result.insertId){
            console.log("------- insertId " + result.insertId +" ------");
          return this.getUserSession(result.insertId);
        }
      })
    });    
  }

  getUserSession(id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`SELECT * FROM session WHERE id = ${id}`, [])
      .then((data)=>{
        if(data.rows.length){
          return data.rows.item(0);
        }
        return null;
      })
    })    
  }

  deleteUserSession(id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`DELETE FROM session WHERE id = ${id}`, [])
    })
  }

  getTodosFromList(listId:number){ }
  addTodo(description:string, isImportant:boolean, isDone:boolean, listId:number){ }
  modifyTodo(description:string, isImportant:boolean, isDone:boolean, id:number){ }
  removeTodo(id:number){ }
}