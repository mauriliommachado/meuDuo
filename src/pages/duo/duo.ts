import { Component } from '@angular/core';
import { NavParams, NavController , AlertController , LoadingController } from 'ionic-angular';
import { PerfilDuoPage } from '../perfilDuo/perfilDuo';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

@Component({
    templateUrl: 'duo.html'
})
export class DuoPage {

    public user;
    public duos;

    public URL: string = 'https://meu-duo.herokuapp.com';

    constructor(public paramCtrl: NavParams,
        public navCtrl: NavController,
        public adMobFree: AdMobFree,
        public http: Http,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,) {
        this.user = JSON.parse(paramCtrl.get('user'));
        //this.getDuos();
        const bannerConfig: AdMobFreeBannerConfig = {
            id: 'ca-app-pub-9244281701655647/6523547220',
            //isTesting: true,
            autoShow: true,bannerAtTop: true
        }

        this.adMobFree.banner.config(bannerConfig);
    }

    ionViewWillEnter() {
        this.showAds();
        this.getDuos();
    }

    ionViewWillLeave() {
        this.adMobFree.banner.hide();
    }

    getDuos() {
        let loader = this.loadingCtrl.create({
            content: "Validando, aguarde...",
        });
        loader.present();
        let header: Headers = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Basic ' + this.user.token);
        let options = new RequestOptions({ headers: header });
        this.http.get(this.URL + '/api/match/' + this.user.id, options)
            .map(res => res.text())
            .toPromise().then(data => {
                this.duos = JSON.parse(data);
                this.duos.forEach((item, index) => {
                    item.elo[0].tier.toLowerCase();
                });
                loader.dismiss();
            }, err => {
                console.log(err);
                loader.dismiss();
                this.alertCtrl.create({
                    title: 'Falha buscando duos',
                    buttons: [{ text: 'Ok' }]
                }).present();
            })
    }

    showAds() {
        try {
            this.adMobFree.banner.prepare().then(() => {
                this.adMobFree.banner.show();
            })
                .catch(e => console.log(e));
        }
        catch (e) {
            console.error(e);
        }
    }

    perfil(duo) {
        this.navCtrl.push(PerfilDuoPage, { user: this.user, duo: duo });
    }
}