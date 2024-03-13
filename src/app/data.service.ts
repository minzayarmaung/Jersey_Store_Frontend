  import { Injectable } from '@angular/core';
  import { HttpClient, HttpStatusCode } from '@angular/common/http'
  import { Observable } from 'rxjs';
  import { InvoiceData } from './components/invoice-data/invoicedata.module';
  import { ReactiveFormsModule } from '@angular/forms';
  import { StockData } from './components/stock-data/stockdata.module';

  @Injectable({
    providedIn: 'root'
  })
  export class DataService {

    private url = "http://localhost:8080/storesystem/store/";

    constructor(private http: HttpClient) {

    }

    // Getting Datas - Reading
    getResultTable(): Observable<any[]>{
      return this.http.get<any[]>(this.url+'all_invoice_data')
    }

    // Adding Data to Invoice - Create
    addInvoiceData(user: InvoiceData): Observable<any> {
      return this.http.post(`${this.url}save/invoiceData`, user, { responseType: 'text' });
    }

    // Adding Data to Stock - Create
    addStockData(user: StockData[]):Observable<any>{
      return this.http.post(`${this.url}save/stockData` , user , { responseType: 'text'});
    }

    // Deleting Data from Stock Data Table
    deleteStockData(id : number):Observable<any>{
      return this.http.delete<any>(`${this.url}deleteStockData/${id}`)
    }

    // Invoice Soft Delete From Database 
    softDelete(id:number){
      return this.http.put(`${this.url}invoice/softDelete/${id}`, null , { responseType: 'text'});
    }

    // Stock Soft Delete From Database
    softDeleteStock(id:number){
      return this.http.put(`${this.url}stock/softDelete/${id}` , null , {responseType: 'text'});
    }

    // Getting Data from Stock Table
    getStockData(): Observable<any[]>{
      return this.http.get<any[]>(this.url+'stock/view_stocks')
    }

    // Get Invoice Data By Id  - Reading 
    getInvoiceDataById(id: number): Observable<InvoiceData>{
      return this.http.get<InvoiceData>(`${this.url}invoice/${id}`)
    } 

    // Get Stock Data By Id - Reading
    getStockDataById(id: number): Observable<StockData>{
      return this.http.get<InvoiceData>(`${this.url}stock/details/${id}`)
    }

    // Updating Invoice Data from Result Table
    updateInvoiceData(id?:number , user?: any): Observable<any>{
      return this.http.put<any>(`${this.url}updateInvoice/${id}`, user)
    }

    // Updating Stock Data from Result Table
    updateStockData(id?:number , user?: any):Observable<any>{
      return this.http.put<any>(`${this.url}updateStock/${id}`, user)
    }

    // Get StockId and Stock Amount By invoiceId LEFT JOIN - Reading
     getInvoiceWithStockDetails(): Observable<any[]>{
      return this.http.get<any[]>(this.url+'invoice/getInvoiceWithStockDetails')
    }

    // Getting Available Stocks
    getAvailableStockIds(): Observable<number[]>{
      return this.http.get<number[]>(`${this.url}stock/getAvailableStockIds`)
    }

    // Getting Available Invoice Ids
    getAvailableInvoiceIds(): Observable<number[]>{
      return this.http.get<number[]>(`${this.url}invoice/getAvailableInvoiceIds`)
    }

    // Saving Both Invoice and Stock Data
    addInvoiceAndStockData(data : FormData): Observable<any>{
      return this.http.post<any>(`${this.url}invoiceAndStockData/save`, data , { responseType: 'text' as 'json'})
    }

    // Updating Both Invoice and Stock Data   
    updateInvoiceAndStockData(id: number , invoice: any , stocks: any[]): Observable<any>{
      const body = {
        invoice : invoice, 
        stocks : stocks
      };
      return this.http.put<any>(`${this.url}updateInvoiceAndStsock/${id}` , body , { responseType: 'text' as 'json'});
    }

    // Getting Invoice And Stock Data by Each ID PDF Export
    getDatabyEachIDPDF(invoiceId: number): Observable<Blob> {
      return this.http.get(`${this.url}pdf/generatePDFById/${invoiceId}`, { responseType: 'blob' });
    }

    // Getting Invoice with Stock Details in PDF Export
    getInvoiceWithStockDetailsPDF(): Observable<Blob>{
      return this.http.get(`${this.url}excel/exportFile` , { responseType : 'blob' });
    }

    // Getting Stock Data in PDF Export 
    getStockDataPDF(): Observable<Blob>{
      return this.http.get(`${this.url}pdf/generatePDFStockList` , {responseType : 'blob'});
    }

    // Gettng Image Photo
    getImagePhoto(invoiceId: number): Observable<Blob>{
      return this.http.get(`${this.url}images/${invoiceId}` , {responseType : 'blob'}) 
    }
    
    // Updating Image Photo 
    updateImagePhoto(invoiceId: number , formData: FormData): Observable<any>{
      return this.http.put(`${this.url}updateImage/${invoiceId}`, formData, { responseType : 'blob'})
    }

  } 