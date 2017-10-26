import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Headers, RequestOptions } from '@angular/http';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public elo: string;
  public rankTier: string;
  public wr: number;
  public lp: number;
  public id: number;
  public flexRankTier: string;
  public checkStatus: boolean = true;
  public user;
  public URL: string = 'https://meu-duo.herokuapp.com';

  constructor(public navCtrl: NavController,
    public paramCtrl: NavParams,
    public http: Http,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public admobFree: AdMobFree) {
    this.user = JSON.parse(paramCtrl.get('user'));
    console.log(this.user.token)
    this.doGet();
    this.showAds();
  }

  showAds() {
    const bannerConfig: AdMobFreeBannerConfig = {
      // add your config here
      // for the sake of this example we will just use the test config
      isTesting: true,
      autoShow: true,
      id: "ca-app-pub-9244281701655647~5660702320"
    };
    this.admobFree.banner.config(bannerConfig);
    this.admobFree.banner.prepare()
      .then(() => {
        // banner Ad is ready
        // if we set autoShow to false, then we will need to call the show method here
      })
      .catch(e => console.log(e));
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
          this.elo = JSON.parse(data)[0].elo[1].tier.toLowerCase();
          this.rankTier = this.titleCase(JSON.parse(data)[0].elo[1].tier) + " " + JSON.parse(data)[0].elo[1].rank;
          this.flexRankTier = this.titleCase(JSON.parse(data)[0].elo[0].tier) + " " + JSON.parse(data)[0].elo[0].rank;
          if ((JSON.parse(data)[0].elo[1].wins + JSON.parse(data)[0].elo[1].losses) == 0) {
            this.wr == 0;
          }
          this.wr = Math.round((JSON.parse(data)[0].elo[1].wins / (JSON.parse(data)[0].elo[1].wins + JSON.parse(data)[0].elo[1].losses)) * 100);
          this.lp = JSON.parse(data)[0].elo[1].leaguePoints;
          this.id = JSON.parse(data)[0].id;
          this.checkStatus = false;
        } else {
          this.checkStatus = true;
        }
      }, err => {
        console.log(err);
        loader.dismiss();
        this.checkStatus = true;
      })
  }

  titleCase(str) {
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
  }

  match() {
    this.doCall(true);
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
                return;
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
  }

  notMatch() {
    this.doCall(false);
  }

}
