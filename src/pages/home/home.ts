import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public elo: string;
  public wr: string;
  public id: number;
  public checkStatus: boolean = true;
  public user;

  constructor(public navCtrl: NavController,
    public paramCtrl: NavParams,
    public http: Http,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {
    this.user = JSON.parse(paramCtrl.get('user'));
    this.doGet();
  }

  doGet() {
    let loader = this.loadingCtrl.create({
      content: "Buscando usuários, aguarde...",
    });
    loader.present();
    let header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', 'Basic ZGlpYW5rOmFkbWlu');
    let options = new RequestOptions({ headers: header });
    this.http.get('http://localhost:8080/api/match/' + this.user.id + '/new', options)
      .map(res => res.text())
      .toPromise().then(data => {
        loader.dismiss();
        if (JSON.parse(data)) {
          this.elo = JSON.parse(data)[0].name;
          this.wr = JSON.parse(data)[0].id;
          this.id = JSON.parse(data)[0].id;
          if (!this.id == null)  {
            this.checkStatus = true;
            return;
          }
          this.checkStatus = false;
        }
      }, err => {
        console.log(err);
        loader.dismiss();
        this.checkStatus = true;
      })
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
    header.append('Authorization', 'Basic ZGlpYW5rOmFkbWlu');
    let options = new RequestOptions({ headers: header });
    var match = { id: this.user.id, matchId: this.id, status: statusMatch };
    this.http.post('http://localhost:8080/api/match', match, options)
      .map(res => res.text())
      .toPromise().then(data => {
        loader.dismiss();
        if(JSON.parse(data).status){
          this.alertCtrl.create({
            title: 'Duo!!',
            buttons: [{ text: 'Ok' }],
            subTitle: 'Entre em contato com seu novo Duo!'
          }).present();
        }
        this.checkStatus = true;
        this.elo = null;
        this.wr = null;
        this.id = null;
        this.doGet()
      }, err => {
        console.log(err);
        this.checkStatus = true;
        loader.dismiss();

        this.alertCtrl.create({
          title: 'Falha na chamada',
          buttons: [{ text: 'Ok' }],
          subTitle: 'Não foi possível fazer o cadastro com os dados enviados.'
        }).present();
      })
  }

  notMatch() {
    this.doCall(false);
  }

}
