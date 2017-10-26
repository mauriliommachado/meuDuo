import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
    templateUrl: 'perfilDuo.html'
})
export class PerfilDuoPage {

    public user;
    public duo;

    constructor(public paramCtrl: NavParams) {
        this.user = paramCtrl.get('user');
        this.duo = {name: 'Diiank', rank: 'silver'};
    }
}