import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { LocationsProvider } from '../../providers/locations/locations';

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class MapPage {

    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
    locationsLoaded: any;
    mapLoaded: any;

    constructor(public navCtrl: NavController, public maps: GoogleMapsProvider, public platform: Platform, public locations: LocationsProvider) {

    }

    ionViewDidLoad() {

        this.platform.ready().then(() => {

            this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(data => {
                this.locations.load(this.maps.giveCoords()).then(innerData => {
                    let coords = this.maps.giveCoords();
                    this.maps.addMarker(coords.latitude, coords.longitude, true);
                    this.locationsLoaded = innerData;
                    let locations = innerData;
                    console.log(innerData);

                    for (let location of locations) {
                        this.maps.addMarker(location.latitude, location.longitude, false);
                    }


                });
                this.mapLoaded = data;
            });


            // Promise.all([
            //     this.mapLoaded,
            //     this.locationsLoaded
            // ]).then((result) => {
            //     console.log(result);

            //     let locations = result[1];

            //     for (let location of locations) {
            //         this.maps.addMarker(location.latitude, location.longitude);
            //     }

            // });

        });

    }


}
