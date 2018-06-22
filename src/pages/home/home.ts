import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController
  ) {}

  viewImage(url) {
    this.modalCtrl
      .create('ImageViewerPage', {
        imageurl: url
      })
      .present();
  }
}
