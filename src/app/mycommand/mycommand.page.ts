import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Article} from '../products/article';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalPage2 } from './modal/modal.page';




@Component({
  selector: 'app-mycommand',
  templateUrl: './mycommand.page.html',
  styleUrls: ['./mycommand.page.scss'],
})
export class MycommandPage implements OnInit {
  
  env: any;
  private articleList : Article[];
  token: string;
  
  constructor(public modalController: ModalController, private route: ActivatedRoute,private http: HttpClient, private router: Router, public toastController: ToastController) {
    this.env = environment;
    this.token = sessionStorage.getItem("token");
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
       if (this.router.getCurrentNavigation().extras.state.refresh){
         this.refreshData();
       }
      }
    });
  }

  refreshData(){
    this.articleList = new Array();
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Authorization' : 'Bearer ' + this.token
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict)
    };
    this.http.get<Article[]>(this.env.api_url + "/article", requestOptions).subscribe(data => {
      this.articleList = data;
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

  ngOnInit() {
    this.refreshData();
  }

  async updateArticle(article: Article){
    let navigationExtras: NavigationExtras = {
      state: {
        article: article
      }
    };
    this.router.navigate(['update-article'], navigationExtras);
    
  }

  async openShops(){
    const modal = await this.modalController.create({
      component: ModalPage2,
      cssClass: 'my-custom-modal-css'
    });
    return await modal.present();
  }

  delete(article: Article){
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Authorization' : 'Bearer ' + this.token
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict)
    };
    this.http.delete<Article>(this.env.api_url+"/article/"+article.id, requestOptions).subscribe(data => {
      this.articleList = this.articleList.filter(obj=>obj!=article);
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

}
