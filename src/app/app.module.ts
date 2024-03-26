import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponentComponent } from './components/home/home-component.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { FilterpipePipe } from './filterpipe.pipe';
import { StockComponent } from './components/stock/stock.component';
import { ResultComponent } from './components/result/result.component';
import { HttpClientModule } from '@angular/common/http';
import { AddStockComponent } from './components/add-stock/add-stock.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports: [
    // Other imports...
    MatSelectModule
  ],
  declarations: [
  
  ],
  // Other module properties...
})
export class YourModule { }

import { MatInputModule } from '@angular/material/input';
import { UpdateInvoiceComponent } from './components/update-invoice/update-invoice.component';
import { ViewStockComponent } from './components/view-stock/view-stock.component';
import { UpdateStockComponent } from './components/update-stock/update-stock.component';
import { StockFilterPipe } from './pipes/stock-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponentComponent,
    InvoiceComponent,
    FilterpipePipe,
    StockComponent,
    ResultComponent,
    AddStockComponent,
    UpdateInvoiceComponent,
    ViewStockComponent,
    UpdateStockComponent ,
    StockFilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    NgxPaginationModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
