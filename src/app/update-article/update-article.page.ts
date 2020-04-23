import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import {Article} from '../products/article';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { $$ } from 'protractor';




@Component({
  selector: 'app-update-article',
  templateUrl: './update-article.page.html',
  styleUrls: ['./update-article.page.scss'],
})
export class UpdateArticlePage implements OnInit { 
   
  env: any;
  @ViewChild('filechooser',null) filechooser: ElementRef;
  @ViewChild('image',null) image: ElementRef;
  items: File[] = [];
  data: Article = new Article();
  token: string;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, public toastController: ToastController) {
    this.env = environment;
    this.token = sessionStorage.getItem("token");
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
       this.data = this.router.getCurrentNavigation().extras.state.article;
      }
    });
  }

  ngOnInit() {
    this.data.disponibility = true;
    this.wireUpFileChooser();
  }
  

  async validateArticle(article: Article){

    article.photo = this.image.nativeElement.src;
    
    if(!article.photo) article.photo = 'data:image/jpeg;base64,notuho';
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Authorization' : 'Bearer ' + this.token
    }
    
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict)
    };
    this.http.post(this.env.api_url + "/article", article, requestOptions).subscribe(async (res) => {

        const toast = await this.toastController.create({
          message: 'Modification de l\'article réussi',
          duration: 2000
        });
        toast.present();
        let navigationExtras: NavigationExtras = {
          state: {
            refresh: true
          }
        };
        this.router.navigate(['/mycommand'], navigationExtras);
      
    }, async (err) => {
      const toast = await this.toastController.create({
        message: err.error.message,
        duration: 2000
      });
      toast.present();
      this.router.navigate(['/home']);
    
  });
    
  }

   toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  
   wireUpFileChooser = () => {
        const filechooser = this.filechooser.nativeElement as HTMLInputElement;
        const image = this.image.nativeElement as HTMLInputElement;
        const regexp = /(http(s?):)?([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/g;
        filechooser.addEventListener('change', async (evt: any) => {
            this.items = new Array();
            const files = evt.target.files as File[];
            for (let i = 0; i < files.length; i++) {
                this.items.push(files[i]);
            }
            if(!this.items[0].name.match(regexp)){
              const toast = await this.toastController.create({
                message: 'Veuillez charger une image!',
                duration: 2000,
              });
              toast.present();
            }
            if( this.items[0].size > 42000){
              const toast = await this.toastController.create({
                message: 'Veuillez charger une image plus petite',
                duration: 2000,
              });
              toast.present();
            }
            else{

              this.toBase64(this.items[0]).then(res => {
                const based: string = res.toString();
                image.src = based;
              });

            }

            
        }, false);
        
  }
  

}
