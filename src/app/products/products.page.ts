import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Mission } from './mission';
import { ModalController } from '@ionic/angular';
import { ModalPage } from './modal/modal.page';
import { ToastController } from '@ionic/angular';
import { AuthGuardService } from '../auth-guard.service';
import { Router } from '@angular/router';
import { Article } from './article';


@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  env: any;
  private missionList : Mission[];
  token: string;
  
  constructor(private auth: AuthGuardService, private http: HttpClient,public modalController: ModalController, public toastController: ToastController, private router: Router) { 
    this.env = environment;
    this.token = sessionStorage.getItem("token");
  }

  openGps(mission: Mission){

  }

  refreshLoca(){
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Authorization' : 'Bearer ' + this.token
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict)
    };
    navigator.geolocation.getCurrentPosition((pos)=>{
      this.http.post(this.env.api_url+'/location',{
          id: parseInt(sessionStorage.getItem('userId')),
          longitude: pos.coords.longitude,
          latitude: pos.coords.latitude,
          user: parseInt(sessionStorage.getItem('userId'))
      }, requestOptions).subscribe( (data) => {
        console.log(data);
      });
    });
  }

  refreshData(){
    this.refreshLoca();
    this.missionList = new Array();
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Authorization' : 'Bearer ' + this.token
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict)
    };
    this.http.get<Mission[]>(this.env.api_url+"/mission", requestOptions).subscribe(data => {
      this.missionList = data;
      this.missionList.map(element=>{
        this.http.get<Article[]>(this.env.api_url+"/mission/articles/"+element.id, requestOptions).subscribe(data => {
          element.articles = data;

          element.total = element.articles.reduce((a, b) => a + (b.price * b.quantity), 0);
        });
        element.color = element.statut.id == 1 ? 'danger': element.statut.id == 2 ? 'warning': 'success';
        var regexp = / /g;
        element.gps = "https://waze.com/ul?q=" + element.adresse.replace(regexp, "%20") +"%20" + element.postal;
      });
    },
    async (err) =>{
      const toast = await this.toastController.create({
        message: 'Erreur lors du chargement des données',
        duration: 2000
      });
      toast.present();
      this.router.navigate(['/home']);
    });
  }

  ngOnInit() {
    this.refreshData();
    setInterval(() => { 
      this.refreshData();
   }, 60000);

  }

  update(mission: Mission, id: number){
    mission.statut = {
      id: id,
      name: id == 2 ? "EN COUR" : "TERMINE" 
    };
    mission.livreur = parseInt(sessionStorage.getItem("userId"));
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Authorization' : 'Bearer ' + this.token
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict)
    };
    this.http.put<Mission[]>(this.env.api_url+"/mission", mission, requestOptions).subscribe(data => {
        this.refreshData();
    },
    async (err) =>{
      const toast = await this.toastController.create({
        message: 'Erreur lors du chargement des données',
        duration: 2000
      });
      toast.present();
      this.router.navigate(['/home']);
    });
  }

  async presentModal(mission: Mission) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        'mission' : mission
      },
      cssClass: 'my-custom-modal-css'
    });
    return await modal.present();
  }
  delete(mission: Mission){
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Authorization' : 'Bearer ' + this.token
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict)
    };
    this.http.delete(this.env.api_url+"/mission/"+mission.id, requestOptions).subscribe(async (res) => {
      const toast = await this.toastController.create({
        message: 'Succès lors de la suppression de la mission',
        duration: 2000
      });
      toast.present();
      this.refreshData();
    },
    async (err) => {
      const toast = await this.toastController.create({
        message: 'Erreur lors de la suppression de la mission',
        duration: 2000
      });
      toast.present();
      this.router.navigate(['/home']);
    })
  }
  logout(){
    this.auth.logout();
  }

}
