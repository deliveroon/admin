import { Component, Input } from '@angular/core';
import { NavParams, ModalController} from '@ionic/angular';
import {Mission} from '../mission';

@Component({
  selector: 'modal-page',
  templateUrl: './modal.page.html',
})
export class ModalPage {

  mission: Mission;

  constructor(navParams: NavParams, private modalCtrl : ModalController) {
    this.mission = navParams.get('mission');
    console.log(this.mission);
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}