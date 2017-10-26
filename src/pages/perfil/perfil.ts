import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Headers, RequestOptions } from '@angular/http';

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
        public paramCtrl: NavParams) {
        this.user = JSON.parse(paramCtrl.get('user'));
    }

    doRegister() {
        let loader = this.loadingCtrl.create({
            content: "Atualizando usuário, aguarde...",
        });
        let senha = this.user.password;
        loader.present();
        let header: Headers = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Basic ' + this.user.token);
        let options = new RequestOptions({ headers: header });
        this.user = { id: this.user.id, name: this.user.name, email: this.user.email, pwd: this.user.password };
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
