import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Headers, RequestOptions } from '@angular/http';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

@Component({
    selector: 'page-perfil',
    templateUrl: 'perfil.html'
})
export class PerfilPage {

    public user;
    public URL: string = 'https://meu-duo.herokuapp.com';

    constructor(public navCtrl: NavController,
        public http: Http,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public paramCtrl: NavParams,
        public adMobFree: AdMobFree) {
        this.user = JSON.parse(paramCtrl.get('user'));
        const bannerConfig: AdMobFreeBannerConfig = {
            id: 'ca-app-pub-9244281701655647/6523547220',
            //isTesting: true,
            autoShow: true,bannerAtTop: true
        }

        this.adMobFree.banner.config(bannerConfig);
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

    ionViewWillEnter() {
        this.showAds();
    }

    ionViewWillLeave() {
        this.adMobFree.banner.hide();
    }

    doRegister() {
        let loader = this.loadingCtrl.create({
            content: "Atualizando usuário, aguarde...",
        });
        loader.present();
        if(!this.user.password){
            this.alertCtrl.create({
                title: 'A senha não pode ser vazia',
                buttons: [{ text: 'Ok' }]
            }).present();
            loader.dismiss();
            return;
        }
        let senha = this.user.password;
        let header: Headers = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Basic ' + this.user.token);
        let options = new RequestOptions({ headers: header });
        this.user = { id: this.user.id, name: this.user.name, email: this.user.email, pwd: this.user.password , discord: this.user.discord };
        this.http.put(this.URL + '/api/users', this.user, options)
            .map(res => res.text())
            .toPromise().then(data => {
                loader.dismiss();
                this.alertCtrl.create({
                    title: 'Atualizado com sucesso!',
                    buttons: [{ text: 'Ok' }]
                }).present();
                this.user = JSON.parse(data);
                this.user.senha = senha;
                this.navCtrl.parent.select(1);
            }, err => {
                console.log(err);

                loader.dismiss();

                this.alertCtrl.create({
                    title: 'Falha na atualização',
                    buttons: [{ text: 'Ok' }],
                    subTitle: 'Não foi possível fazer a atualização com os dados enviados.'
                }).present();
            })
    }


}
