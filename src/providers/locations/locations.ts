import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
  Generated class for the LocationsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocationsProvider {
    coords: any;

    data: any;

    constructor(public http: Http, public loadingCtrl: LoadingController) {

    }

    load(coords) {
        let loader = this.loadingCtrl.create({
            content: 'Please Wait...'
        })
        loader.present();
        this.coords = coords;

        console.log(coords);

        if (this.data) {
            return Promise.resolve(this.data);
        }

        return new Promise(resolve => {

            this.http.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+coords.latitude+','+coords.longitude+'&radius=2500&type=gas_station&key=AIzaSyACX8fw6zTKoxykYwj4vmWWkpPDm_gMBWs').map(res => res.json()).subscribe(data => {

                this.data = { locations: [] };

                for (let value of data.results) {
                    this.data.locations.push({ latitude: value.geometry.location.lat, longitude: value.geometry.location.lng, title: value.name })
                    console.log(this.data);
                }

                this.data = this.applyHaversine(this.data.locations);
                loader.dismiss();

                this.data.sort((locationA, locationB) => {
                    return locationA.distance - locationB.distance;
                });

                resolve(this.data);
            });

        });

    }

    applyHaversine(locations) {
        console.log(locations);

        let usersLocation = {
            lat: this.coords.latitude,
            lng: this.coords.longitude
        };

        locations.map((location) => {

            let placeLocation = {
                lat: location.latitude,
                lng: location.longitude
            };

            location.distance = this.getDistanceBetweenPoints(
                usersLocation,
                placeLocation,
                'miles'
            ).toFixed(2);
        });

        return locations;
    }

    getDistanceBetweenPoints(start, end, units) {

        let earthRadius = {
            miles: 3958.8,
            km: 6371
        };

        let R = earthRadius[units || 'miles'];
        let lat1 = start.lat;
        let lon1 = start.lng;
        let lat2 = end.lat;
        let lon2 = end.lng;

        let dLat = this.toRad((lat2 - lat1));
        let dLon = this.toRad((lon2 - lon1));
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;

        return d;

    }

    toRad(x) {
        return x * Math.PI / 180;
    }
}
