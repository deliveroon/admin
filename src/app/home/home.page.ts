import { Component } from '@angular/core';
import { AuthGuardService } from '../auth-guard.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username: string = "";
  password: string = "";

  constructor(private auth: AuthGuardService, private toastController : ToastController) {
  }

  async connect(){
    if(! this.username || ! this.password){
      const toast = await this.toastController.create({
        message: 'Veuillez remplir les champs',
        duration: 2000
      });
      toast.present();
    }
    else{
      this.auth.authentication(this.username, this.password);
    }
    
  }

}
