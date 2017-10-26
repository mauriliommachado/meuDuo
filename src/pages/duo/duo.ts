import { Component } from '@angular/core';
import { NavParams , NavController } from 'ionic-angular';
import { PerfilDuoPage } from '../perfilDuo/perfilDuo';

@Component({
    templateUrl: 'duo.html'
})
export class DuoPage {

    public user;
    public duos;

    constructor(public paramCtrl: NavParams,public navCtrl: NavController) {
        this.user = JSON.parse(paramCtrl.get('user'));
        this.duos = [{name: 'Diiank', rank: 'silver'},{name: '100regras', rank: 'platinum'}]
    }

    perfil(name :string){
        console.log(name);
        this.navCtrl.push(PerfilDuoPage, {user: this.user});

    }
}