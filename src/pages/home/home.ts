import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  cities: any[];
  city: string = 'Chennai';
  fuel: string = 'petrol';
  dprice: any;
  pprice: any;
  lst_city: any;
  showFuel: any;

  constructor(public navCtrl: NavController, public _http: Http, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();
    this.getAvailableCities().subscribe(data => {
      this.cities = data.cities;
      loader.dismiss();
    })
    this.getPriceQuote();
  }

  getPriceQuote() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    if (this.city == null) {
      const toast = this.toastCtrl.create({
        message: 'Please select a city to get price information',
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      toast.present();
    } else {
      loader.present();
      // console.log(this.city, this.fuel);
      this.getPetrolPriceDetails(this.city).subscribe(data => {
        this.pprice = data.price;
        this.lst_city = this.city;
        loader.dismiss();
      }, error => {
        loader.dismiss();
        console.log(error);
      });
      let loader1 = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader1.present();
      this.getDieselPriceDetails(this.city).subscribe(data => {
        this.dprice = data.price;
        this.lst_city = this.city;
        loader1.dismiss();
      }, error => {
        loader.dismiss();
        console.log(error);
      })
    }
  }


  getAvailableCities() {
    return this._http.get('https://still-tundra-35330.herokuapp.com/main/city_list')
      .map(response => <any>response.json())
      .catch(this.handleError);
  }

  getPetrolPriceDetails(city) {
    return this._http.get('https://still-tundra-35330.herokuapp.com/main/' + city + '/petrol/price')
      .map(response => <any>response.json())
      .catch(this.handleError);
  }

  getDieselPriceDetails(city) {
    return this._http.get('https://still-tundra-35330.herokuapp.com/main/' + city + '/diesel/price')
      .map(response => <any>response.json())
      .catch(this.handleError);
  }

  // Handling all type of errors in http calls
  private handleError(error: Response | any) {
    // this._utility.hideLoader();
    // We might use a remote logging infrastructure if needed
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.message || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    // console.error(errMsg);
    alert('Network connection problem. Please Switch ON your mobile data or connect with WiFi');
    return Observable.throw(errMsg);
  }

}
