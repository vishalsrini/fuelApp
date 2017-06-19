import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network'
import 'rxjs/add/operator/map';

declare var Connection;

/*
  Generated class for the ConnectivityProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ConnectivityProvider {
  onDevice: boolean;

  constructor(public http: Http, public platform: Platform, public network: Network) {
    console.log('Hello ConnectivityProvider Provider');
    this.onDevice = this.platform.is('cordova');
  }

  isOnline(): boolean {
    if (this.onDevice) {
      return this.network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  isOffline(): boolean {
    if (this.onDevice) {
      return this.network.type === Connection.NONE;
    } else {
      return !navigator.onLine;
    }
  }

}
