import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { transition } from '@angular/animations';
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

  // charts
  title = 'Multi-Series Line Chart';

  data: any;

  svg: any;
  margin = {top: 20, right: 80, bottom: 30, left: 50};
  g: any;
  width: number;
  height: number;
  x;
  y;
  z;
  line;
  TEMPERATURES: any[];
  /* demo customer & account info*/
  customerId = '1';
  accounts: any[];
  transitions: any[];
  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.TEMPERATURES = [];
    this.http.get('https://api.azureminilab.com/customers/' + this.customerId + '/accounts', httpOptions)
      .subscribe(res => {
        this.accounts = res as any[];
        // this.accounts = this.accounts.filter(a => a.type !== 'Chequing');
        console.log('Accounts', this.accounts);
        this.accounts.forEach(e => {
          this.http.get('https://api.azureminilab.com/accounts/' + e.id + '/transactions', httpOptions).subscribe(resp => {
            this.transitions = resp as any[];
            this.transitions.sort((a, b) => a.transaction_date.substr(0, 10) < b.transaction_date.substr(0, 10) ? -1 : 1);
            console.log(e.id, this.transitions);
            const data = this.transitions.map(r => {
              return {'date': new Date(r.transaction_date), 'temperature':
              ((r.type === 'CREDIT' ? -1 : 1) * parseFloat(r.transaction_value))};
            });
            console.log(e.id, data);
            this.TEMPERATURES.push(
              {
                  'id': e.label,
                  'values': data
              });
              this.data = data.map((v) => v.date );
              if (this.TEMPERATURES.length === this.accounts.length) {
                this.createChart();
              }
          }, erro => {
            console.log(e.id, erro); this.TEMPERATURES.push(
              {
                  'id': e.label,
                  'values': []
              });
            if (this.TEMPERATURES.length === this.accounts.length) {
              this.createChart();
            }
          });
        });
      });
  }

  createChart(): void {

    // this.data = data;
    console.log('dates', this.data);
    this.initChart();
    this.drawAxis();
    if (this.data !== undefined || this.data.length !== 0) {
      this.drawPath();
    }
  }
  private initChart(): void {
    this.svg = d3.select('svg');

    this.width = this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = this.svg.attr('height') - this.margin.top - this.margin.bottom;

    this.g = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.z = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10);

    this.line = d3Shape.line()
        .curve(d3Shape.curveBasis)
        .x( (d: any) => this.x(d.date) )
        .y( (d: any) => this.y(d.temperature) );

    this.x.domain(d3Array.extent(this.data, (d: Date) => d ));

    this.y.domain([
        d3Array.min(this.TEMPERATURES, function(c) { return d3Array.min(c.values, function(d) { return d.temperature; }); }),
        d3Array.max(this.TEMPERATURES, function(c) { return d3Array.max(c.values, function(d) { return d.temperature; }); })
    ]);

    this.z.domain(this.TEMPERATURES.map(function(c) { return c.id; }));
}

private drawAxis(): void {
    this.g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3Axis.axisBottom(this.x));

    this.g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3Axis.axisLeft(this.y))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('fill', '#000')
        .text('CAD, $');
}

private drawPath(): void {
    let city = this.g.selectAll('.city')
        .data(this.TEMPERATURES)
        .enter().append('g')
        .attr('class', 'city');

    city.append('path')
        .attr('class', 'line')
        .attr('d', (d) => this.line(d.values) )
        .style('stroke', (d) => this.z(d.id) );

    city.append('text')
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr('transform', (d) => 'translate(' +
        this.x(d.value === undefined ? 0 : d.value.date) + ',' + this.y(d.value === undefined ? 0 : d.value.temperature) + ')' )
        .attr('x', 3)
        .attr('dy', '0.35em')
        .style('font', '10px sans-serif')
        .text(function(d) { return d.id; });
}

}
