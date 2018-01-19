import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { DetalhePage } from '../detalhe/detalhe';
import { NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Headers, RequestOptions } from '@angular/http';
import { AdMobFree, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public summoners;

  public elo: string;
  public rankTier: string;
  public wr: number;
  public lp: number;
  public id: number;
  public flexRankTier: string;
  public checkStatus: boolean = true;
  public user;
  public URL: string = 'https://meu-duo.herokuapp.com';
  public adsCounter: number = 0;

  constructor(public navCtrl: NavController,
    public paramCtrl: NavParams,
    public http: Http,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public adMobFree: AdMobFree) {
    this.user = JSON.parse(paramCtrl.get('user'));
    const bannerConfig: AdMobFreeInterstitialConfig = {
      id: 'ca-app-pub-9244281701655647/4663670641',
      //isTesting: true,
      autoShow: true
    }

    this.adMobFree.interstitial.config(bannerConfig);
    this.showAds();
  }

  showAds() {
    try {
      this.adMobFree.interstitial.prepare().then(() => {
        this.adMobFree.interstitial.show();
        this.doGet();
        this.adsCounter = 0;
      })
        .catch(e => console.log(e));
    }
    catch (e) {
      console.error(e);
    }
  }

  doGet() {
    let loader = this.loadingCtrl.create({
      content: "Buscando usuários, aguarde...",
    });
    loader.present();
    let header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', 'Basic ' + this.user.token);
    let options = new RequestOptions({ headers: header });
    this.http.get(this.URL + '/api/match/' + this.user.id + '/new', options)
      .map(res => res.text())
      .toPromise().then(data => {
        loader.dismiss();
        if (JSON.parse(data) != null) {
          this.summoners = JSON.parse(data);
          this.checkStatus = false;
          this.preencheSummoner();
        } else {
          this.checkStatus = true;
        }
      }, err => {
        console.log(err);
        loader.dismiss();
        this.checkStatus = true;
      })
  }

  preencheSummoner() {
    this.elo = this.summoners[0].elo[0].tier.toLowerCase();
    this.rankTier = this.titleCase(this.summoners[0].elo[0].tier) + " " + this.summoners[0].elo[0].rank;
    this.flexRankTier = this.titleCase(this.summoners[0].elo[1].tier) + " " + this.summoners[0].elo[1].rank;
    if ((this.summoners[0].elo[1].wins + this.summoners[0].elo[0].losses) == 0) {
      this.wr == 0;
    }
    this.wr = Math.round((this.summoners[0].elo[0].wins / (this.summoners[0].elo[0].wins + this.summoners[0].elo[0].losses)) * 100);
    this.lp = this.summoners[0].elo[0].leaguePoints;
    this.id = this.summoners[0].id;
  }

  titleCase(str) {
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
  }

  match() {
    this.doCall(true);
  }

  detalhe() {
    let summoner = this.summoners[0];
    summoner.name = this.titleCase(summoner.elo[0].tier);
    this.navCtrl.push(DetalhePage, { user: this.user, duo: summoner });
  }

  doCall(statusMatch: boolean) {
    let loader = this.loadingCtrl.create({
      content: "Aguarde...",
    });
    loader.present();
    let header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', 'Basic ' + this.user.token);
    let options = new RequestOptions({ headers: header });
    var match = { id: this.user.id, matchId: this.id, status: statusMatch };
    this.http.post(this.URL + '/api/match', match, options)
      .map(res => res.text())
      .toPromise().then(data => {
        loader.dismiss();
        if (JSON.parse(data).status == true) {
          this.alertCtrl.create({
            title: 'Duo!!',
            buttons: [{
              text: 'Ok', role: 'ok', handler: () => {
                this.doGet();
                this.showAds();
              }
            }],
            subTitle: 'Entre em contato com seu novo Duo!'
          }).present();
        } else {
          this.doGet();
        }
      }, err => {
        console.log(err);
        this.checkStatus = true;
        loader.dismiss();

        this.alertCtrl.create({
          title: 'Falha na chamada',
          buttons: [{
            text: 'Ok', role: 'ok', handler: () => {
              this.elo = null;
              this.wr = null;
              this.id = null;
              this.doGet();
            }
          }],
          subTitle: 'Não foi possível fazer o cadastro com os dados enviados.'
        }).present();
      })
    this.summoners.splice(0, 1);
    if (this.summoners.length <= 0) {
      this.doGet();
    }
    if (this.adsCounter == 5) {
      this.adsCounter = 0;
      this.showAds();
    } else {
      this.adsCounter++
    }
  }

  notMatch() {
    this.doCall(false);
  }

}
