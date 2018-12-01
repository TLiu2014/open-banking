import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as d3 from 'd3';
const httpOptions = {
  headers: new HttpHeaders({
    // 'Content-Type':  'application/json',
    'Ocp-Apim-Subscription-Key': '5b47e3170d1b42688dbe1474941f4060'
  })
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  /* demo customer & account info*/
  customerId = '1';
  accounts: any[];
  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get('https://api.azureminilab.com/customers/' + this.customerId + '/accounts', httpOptions)
      .subscribe(res => {
        this.accounts = res  as any[];
        console.log('Accounts', this.accounts);
        this.accounts.forEach(e => {
          this.http.get('https://api.azureminilab.com/accounts/' + e.id + '/transactions', httpOptions).subscribe(resp => {
            console.log(e.id, resp);
          }, erro => {
            console.log(e.id, erro);

          });
        });
      });
  }

}
