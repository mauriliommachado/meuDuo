import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Headers, RequestOptions } from '@angular/http';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {

    public user;

    public name: string;
    public email: string;
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

    doRegister() {
        let loader = this.loadingCtrl.create({
            content: "Criando usuário, aguarde...",
        });
        loader.present();
        let header: Headers = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Basic ZGlpYW5rOmFkbWlu');
        let options = new RequestOptions({ headers: header });
        this.user = { name: this.name, email: this.email, pwd: this.password };
        this.http.post(this.URL + '/api/users', this.user, options)
            .map(res => res.text())
            .toPromise().then(data => {
                loader.dismiss();
                this.navCtrl.setRoot(LoginPage);
            }, err => {
                console.log(err);

                loader.dismiss();

                this.alertCtrl.create({
                    title: 'Falha no cadastro',
                    buttons: [{ text: 'Ok' }],
                    subTitle: 'Não foi possível fazer o cadastro com os dados enviados.'
                }).present();
            })
    }


}
