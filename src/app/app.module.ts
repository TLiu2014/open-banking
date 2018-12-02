import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomerComponent } from './customer/customer.component';
import { DashboardComponent, AddDialog } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule, MatTableModule, MatButtonModule, MatDividerModule, MatFormFieldModule, MatInputModule,
  MatDatepickerModule, MatNativeDateModule, 
  MatDialogModule} from '@angular/material';
import { AddgoalComponent } from './addgoal/addgoal.component';
@NgModule({
  declarations: [
    AppComponent,
    CustomerComponent,
    DashboardComponent,
    AddgoalComponent,
    AddDialog
  ],

  entryComponents: [
    AddDialog
  ],
  imports: [
    // AddDialog,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatDialogModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule ,
    MatTableModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
  ],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
