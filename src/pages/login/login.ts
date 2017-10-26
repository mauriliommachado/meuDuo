import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    public user;

    public name: string;
    public password: string;
    public URL: string = 'https://meu-duo.herokuapp.com';

    constructor(public navCtrl: NavController,
        public http: Http,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public admobFree: AdMobFree) {
        this.showAds();
    }

    showAds() {
        const bannerConfig: AdMobFreeBannerConfig = {
            // add your config here
            // for the sake of this example we will just use the test config
            isTesting: true,
            autoShow: true,
            id: "ca-app-pub-9244281701655647~5660702320"
        };
        this.admobFree.banner.config(bannerConfig);
        this.admobFree.banner.prepare()
            .then(() => {
                // banner Ad is ready
                // if we set autoShow to false, then we will need to call the show method here
            })
            .catch(e => console.log(e));
    }
    signIn() {
        this.navCtrl.push(RegisterPage);
    }

    doLogin() {
        let loader = this.loadingCtrl.create({
            content: "Validando, aguarde...",
        });
        loader.present();
        let hash = btoa(this.name.toLocaleLowerCase() + ":" + this.password);
        this.http.get(this.URL + '/api/users/validate/' + hash)
            .map(res => res.text())
            .toPromise().then(user => {
                this.navCtrl.setRoot(TabsPage, { 'user': user });
                loader.dismiss();
            }, err => {
                console.log(err);
                loader.dismiss();
                this.alertCtrl.create({
                    title: 'Falha no login',
                    buttons: [{ text: 'Ok' }],
                    subTitle: err
                }).present();
            })
    }
}
