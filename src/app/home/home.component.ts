import { urlBase } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  formData: FormGroup;
  regionList: any;
  showDetails: boolean = false;
  showCountry: boolean = false;
  listInfoCountry: any;
  flagCountrySelect: string = "";
  showSelectFlag: boolean = false;
  alphaSelect: string = "";

  constructor(public formBuilder: FormBuilder,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private router: Router) {

    this.createForm();

    this.regionList = [
      {
        name: "África",
        idValue: 'africa'
      },
      {
        name: "América",
        idValue: 'americas'
      },
      {
        name: "Ásia",
        idValue: 'asia'
      },
      {
        name: "Europa",
        idValue: 'europe'
      },
      {
        name: "Oceania",
        idValue: 'oceania'
      }
    ];

    this.listInfoCountry = [];

  }

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  createForm() {
    this.formData = this.formBuilder.group({
      region: ['', Validators.required]
    });
  }

  findCountry() {

    this.spinner.show();

    this.listInfoCountry = [];

    let reg = this.formData.get('region').value;
    console.log('região selecionada: ', reg);

    // Envia requisição
    this.http.get(urlBase + reg).subscribe((country: any) => {
      console.log('Países da região: ', country);
      this.spinner.hide();
      this.showDetails = true;
      this.showCountry = true;

      // Lista auxiliar para view
      country.forEach(c => {
        let objCountry = {
          name: null,
          flag: null,
          alpha: null,
          ctId: null
        };

        c.name !== undefined ? objCountry.name = c.name : 'indisponível';
        c.flag !== undefined ? objCountry.flag = c.flag : 'indisponível';
        c.alpha2Code !== undefined ? objCountry.alpha = c.alpha2Code : 'indisponível';
        objCountry.ctId = c.alpha2Code + "***" + c.flag;

        this.listInfoCountry.push(objCountry);
      });

      console.log('\nLISTTT --> ', this.listInfoCountry);

    }, (e: any) => {
      this.spinner.hide();
      this.showDetails = false;
      this.showCountry = false;
      console.error('Erro get países: ', e);
    });
  }

  getFlag(evt) {
    console.log('Event received', evt);
    let auxTool = evt.split('***');

    this.flagCountrySelect = '';
    this.flagCountrySelect = auxTool[1];
    this.showSelectFlag = true;
    this.alphaSelect = auxTool[0];

  }

  moreInfos() {
    console.log('More infos');
    this.router.navigate(['/info'], { queryParams: { infoAlpha: this.alphaSelect } });
  }

}
