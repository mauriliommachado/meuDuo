import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { PerfilPage } from '../perfil/perfil';
import { RegisterPage } from '../register/register';
import { NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = PerfilPage;
  tab2Root = HomePage;
  tab3Root = PerfilPage;

  constructor(public paramCtrl: NavParams) {
    
  }
}