import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { PerfilDuoPage } from '../perfilDuo/perfilDuo';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

@Component({
    templateUrl: 'duo.html'
})
export class DuoPage {

    public user;
    public duos;

    constructor(public paramCtrl: NavParams,
        public navCtrl: NavController,
        public adMobFree: AdMobFree) {
        this.user = JSON.parse(paramCtrl.get('user'));
        this.duos = [{ name: 'Diiank', rank: 'silver' }, { name: '100regras', rank: 'platinum' }]

    }

    ionViewWillEnter() {
        this.showAds();
    }

    ionViewWillLeave() {
        this.adMobFree.banner.hide();
    }

    showAds() {
        try {
            const bannerConfig: AdMobFreeBannerConfig = {
                id: 'ca-app-pub-9244281701655647/6523547220',
                //isTesting: true,
                autoShow: true,bannerAtTop: true
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

    perfil(name: string) {
        console.log(name);
        this.navCtrl.push(PerfilDuoPage, { user: this.user });
    }
}