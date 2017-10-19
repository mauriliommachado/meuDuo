import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
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

    constructor(public navCtrl: NavController,
        public http: Http,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController) {

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
        this.http.get('http://localhost:8080/api/users/validate/' + hash)
            .map(res => res.text())
            .toPromise().then(user => {
                this.user = user;
                this.navCtrl.setRoot(HomePage, { 'user': user });
                loader.dismiss();
            }, err => {
                console.log(err);
                loader.dismiss();
                this.alertCtrl.create({
                    title: 'Falha no login',
                    buttons: [{ text: 'Ok' }],
                    subTitle: 'Tente novamente mais tarde'
                }).present();
            })
    }
}
