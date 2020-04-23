import { Component, Input } from '@angular/core';
import { NavParams, ModalController} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Shop } from '../shop';
import { environment } from 'src/environments/environment';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { ModalPage3 } from './modal/modal.page';



@Component({
  selector: 'modal-page2',
  templateUrl: './modal.page.html',
})
export class ModalPage2 {

  shops: Shop[];
  env: any;
  token: string;

  constructor(public modalController: ModalController, private clipboard: Clipboard, private toastController: ToastController, private router: Router, private http: HttpClient, private modalCtrl : ModalController) {
    this.env = environment;
    this.refreshData();
    setInterval(() => { 
      this.refreshData(); // Now the "this" still references the component
   }, 1000);
  }

  refreshData(){
    this.token = sessionStorage.getItem("token");
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Authorization' : 'Bearer ' + this.token
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict)
    };
    this.http.get<Shop[]>(this.env.api_url + "/shop", requestOptions).subscribe(data => {
      this.shops = data;
    },
    async (err)=>{
      const toast = await this.toastController.create({
        message: 'Erreur lors du chargement des données',
        duration: 2000
      });
      toast.present();
      this.router.navigate(['/home']);
    });
  }

  copy(value){
    this.clipboard.copy(this.env.shop_url+"/shop/"+value);
  }

  delete(shop: Shop){
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Authorization' : 'Bearer ' + this.token
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict)
    };
    this.http.delete<Shop[]>(this.env.api_url + "/shop/" + shop.id, requestOptions).subscribe(async (data) => {
      const toast = await this.toastController.create({
        message: 'Magasin supprimé avec succès',
        duration: 2000
      });
      toast.present();
      this.refreshData();
    },
    async (err)=>{
      const toast = await this.toastController.create({
        message: 'Erreur lors du chargement des données',
        duration: 2000
      });
      toast.present();
      this.router.navigate(['/home']);
    });
  }
  async addShop(){
    const modal = await this.modalController.create({
      component: ModalPage3,
      cssClass: 'my-custom-modal-css'
    });
    return await modal.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}