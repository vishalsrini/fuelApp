import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LocationsProvider } from '../../providers/locations/locations';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  constructor(public navCtrl: NavController, public locations: LocationsProvider, public maps: GoogleMapsProvider) {

  }

  ionViewDidLoad() {
    console.log('Hello ListPage Page');
  }

  navigate(latitude, longitude) {
    let coords = {latitude: latitude, longitude: longitude};
    this.maps.navigateToGoogleMaps(coords);
  }
}
