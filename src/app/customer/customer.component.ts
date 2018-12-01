import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({
    // 'Content-Type':  'application/json',
    'Ocp-Apim-Subscription-Key': '5b47e3170d1b42688dbe1474941f4060'
  })
};
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  customers: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('https://api.azureminilab.com/customers/', httpOptions)
      .subscribe(res => {
        console.log(res);
        this.customers = res;
      });
  }

}
