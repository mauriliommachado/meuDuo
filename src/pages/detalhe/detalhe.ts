import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

@Component({
    templateUrl: 'detalhe.html'
})
export class DetalhePage {

    public user;
    public duo;

    constructor(public paramCtrl: NavParams,
        public adMobFree: AdMobFree) {
        this.user = paramCtrl.get('user');
        this.duo = paramCtrl.get('duo');
        //this.adMobFree.banner.hide();
    }

    ionViewWillEnter() {
        //this.adMobFree.banner.hide();
    }
}