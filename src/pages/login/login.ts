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
        public adMobFree: AdMobFree) {
        this.showAds();
    }

    showAds() {
        try {
            const bannerConfig: AdMobFreeBannerConfig = {
                id: 'ca-app-pub-9244281701655647/6523547220',
                //isTesting: true,
                autoShow: true
            }

            this.adMobFree.banner.config(bannerConfig);
            this.adMobFree.banner.prepare().then(() => {
                this.adMobFree.banner.show();
            })
                .catch(e => console.log(e));
        }
        catch (e) {
            console.error(e);
        }
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
                this.adMobFree.banner.remove();
                this.navCtrl.setRoot(TabsPage, { 'user': user });
                loader.dismiss();
            }, err => {
                console.log(err);
                loader.dismiss();
                this.alertCtrl.create({
                    title: 'Falha no login',
                    buttons: [{ text: 'Ok' }],
                    subTitle: "Credenciais não encontradas"
                }).present();
            })
    }
}
