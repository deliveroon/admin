import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { NavParams, ModalController, ToastController} from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'modal-page3',
  templateUrl: './modal.page.html',
})
export class ModalPage3 {

  country: string = 'france';
  token: string;
  env: any;

  constructor(private router: Router, private toastController: ToastController, private modalCtrl : ModalController, private http: HttpClient) {
    this.env = environment;
    this.token = sessionStorage.getItem("token");
  }

  createShop(){
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Authorization' : 'Bearer ' + this.token
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict)
    };
    this.http.post(this.env.api_url + "/shop/" +this.country, null, requestOptions).subscribe(async (data) => {
      const toast = await this.toastController.create({
        message: 'Magasin creer avec succès',
        duration: 2000
      });
      toast.present();
    },
    async (err)=>{
      const toast = await this.toastController.create({
        message: 'Erreur lors de la creation du magasin',
        duration: 2000
      });
      toast.present();
      this.router.navigate(['/home']);
    });
  }

  change(event){
    this.country= event.target.value;
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}