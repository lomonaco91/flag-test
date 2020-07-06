import { urlBaseAlpha } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-info',
  templateUrl: './add-info.component.html',
  styleUrls: ['./add-info.component.css']
})
export class AddInfoComponent implements OnInit {

  // borderCountries: any;
  languageCountry: any;

  objCountrySelect: any = {
    bandeira: null,
    nome: null,
    capital: null,
    regiao: null,
    subRegiao: null,
    populacao: null,
    linguas: null,
    paisesVizinhos: null
  }

  constructor(private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    // this.borderCountries = [];
    this.languageCountry = [];
  }


  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      this.checkInfoCountry();
    }, 2000);
  }

  checkInfoCountry() {

    this.spinner.show();

    this.route.queryParams.subscribe((params: any) => {
      console.log('Alpha country recived: ', params.infoAlpha);

      if (params.infoAlpha !== '' || params.infoAlpha !== undefined || params.infoAlpha !== null) {
        // Req for info
        this.http.get(urlBaseAlpha + params.infoAlpha).subscribe(async (resAlpha: any) => {
          console.log('RES ALPHA -> ', resAlpha);

          // // P. vizinho
          // resAlpha.borders.forEach(b => {
          //   this.borderCountries.push(b);
          // });

          // Linguas
          resAlpha.languages.forEach(l => {
            this.languageCountry.push(l);
          });

          this.objCountrySelect.bandeira = resAlpha.flag;
          this.objCountrySelect.nome = resAlpha.name;
          this.objCountrySelect.capital = resAlpha.capital;
          this.objCountrySelect.regiao = resAlpha.region;
          this.objCountrySelect.subRegiao = resAlpha.subregion;
          this.objCountrySelect.populacao = resAlpha.population;
          this.objCountrySelect.linguas = this.languageCountry;
          // this.objCountrySelect.paisesVizinhos = this.borderCountries;

          this.spinner.hide();

          console.log('Obj detalhe país: ', this.objCountrySelect);

        }, async (e: any) => {
          this.spinner.hide();
          console.error('Error get alpha: ', e);
        });
      }

    });

  }

}
