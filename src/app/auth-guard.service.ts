import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from './user'
import { ToastController } from '@ionic/angular';
import { Token } from './token';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate {
  constructor(private toastController: ToastController,private http: HttpClient, private router: Router) {
    this.env = environment;
  }

  env: any;
  private authInfo: any = {
    authenticated: false
  };
  setToken(username, password)  {
    this.http.post<Token>(this.env.api_url+"/auth/login", {
      username: username,
      password: password
    }).subscribe((res)=>{
      sessionStorage.setItem("token", res.access_token);
      this.authInfo.authenticated = true;
      this.router.navigate(["products"]);
    },
    async (err)=>{
      const toast = await this.toastController.create({
        message: 'Token error',
        duration: 2000
      });
      toast.present();
    });

  }


  authentication(username, password){
    this.http.get<User>(this.env.api_url + "/user/"+ username).subscribe(async (data) => {
      var hash = CryptoJS.SHA512(password).toString();
      if(!data) {
        const toast = await this.toastController.create({
          message: 'Nom d\'utilisateur ou mot de passe incorrect',
          duration: 2000
        });
        toast.present();
      }
      else{
        if(data.password === hash){
          sessionStorage.setItem("userId", data.id.toString())
          this.setToken(username, hash)     
        }
        else{
          const toast = await this.toastController.create({
            message: 'Nom d\'utilisateur ou mot de passe incorrect',
            duration: 2000
          });
          toast.present();
        }
      }
      
    },
    async (err)=>{
      const toast = await this.toastController.create({
        message: 'Erreur lors du chargement des données',
        duration: 2000
      });
      toast.present();
    });
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    if (! this.authInfo.authenticated) {
      this.router.navigate(["home"]);
      return false;
    }

    return true;
  }
  logout(){
    window.location.reload();
  }
}