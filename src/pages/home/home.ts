import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
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
  price: any;

  constructor(public navCtrl: NavController, public _http: Http, public toastCtrl: ToastController) {
    this.getAvailableCities().subscribe(data => {
      this.cities = data.cities;
    })
  }

  getPriceQuote() {
    if (this.city == null) {
      const toast = this.toastCtrl.create({
        message: 'Please select a city to get price information',
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      toast.present();
    } else {
      // console.log(this.city, this.fuel);
      this.getPriceDetails(this.fuel, this.city).subscribe(data => {
        this.price = data.price;
        const toast = this.toastCtrl.create({
          message: this.fuel.toUpperCase() + ' price at ' + this.city.toUpperCase() + ' is ' + this.price,
          showCloseButton: true,
          closeButtonText: 'Ok'
        });
        toast.present();
      }, error => {
        console.log(error);
      })
    }
  }


  getAvailableCities() {
    // console.log(JSON.stringify(data));
    // const request = { scheduleInquiryRequest:  data };
    // console.log(JSON.stringify(request));
    return this._http.get('https://still-tundra-35330.herokuapp.com/main/city_list')
      .map(response => <any>response.json())
      .catch(this.handleError);
  }

  getPriceDetails(fuelType, city) {
    // console.log(JSON.stringify(data));
    // const request = { scheduleInquiryRequest:  data };
    // console.log(JSON.stringify(request));
    return this._http.get('https://still-tundra-35330.herokuapp.com/main/' + city + '/' + fuelType + '/price')
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
    alert('System Error!!!' + errMsg);
    return Observable.throw(errMsg);
  }

}
