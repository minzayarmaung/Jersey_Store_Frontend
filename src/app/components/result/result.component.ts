// result.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { catchError, forkJoin, map, of, tap } from 'rxjs';

interface User {
  id: number;
  stockId?: number;
  cashierName: string;
  stockName: string;
  date: string;
  time: string;
  branch: string;
  center: string;
  status: string;
  amount: number;
}



@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  users: User[] | undefined;
  url: string = "http://localhost:8080/";

  constructor(private service: DataService, private router: Router , private http: HttpClient ) {}

  // Soft Delete Function
  deleteSoftRecord(id: number){
    console.log('ID:' , id);
  
    // Display a confirmation dialog
    let confirmDelete = window.confirm('Are you sure you want to delete this record?');
  
    if (confirmDelete) {
      this.service.softDelete(id).subscribe(
        (response)=>{
          console.log("Soft Deleted Successfully !" , response)
          alert("Soft Deleted Successfully !");
          window.location.reload();
        },
  
        (error) => {
          console.log("Error Soft Deleting !" , error)
          alert("Error Soft Deleting !");
        }
      );
    }
  }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  

  // Showing Only Unique Data With Unique Invoice ID . Not Duplicate
  ngOnInit(): void {
    this.service.getInvoiceWithStockDetails().subscribe((data: any[][]) => {
      // Make a new Variable to check
      const uniqueInvoices = data.reduce((acc, curr) => {
        if (!acc.find(item => item.invoiceId === curr[0])) {
          acc.push({
            id: curr[0],
            invoiceId: curr[0],
            cashierName: curr[1],
            stockName: curr[8],
            date: curr[2],
            time: curr[3],
            branch: curr[4],
            center: curr[5],
            status: curr[6],
            stockId: curr[7],
            amount: curr[9]
          });
        }
        return acc;
      }, []);
      this.users = uniqueInvoices.filter(user => user.status !== 'inactive');
      this.totalRows = this.users.length;
    });  
  }
  
  
  // Excel Export Function Start

  /* Default Name for Excel file when Download */
  fileName = "ExportExcelSheetFile.xlsx";

  // Export to Excel File
  exportExcel(){

    this.http.get('http://localhost:8080/excel/exportData' , {responseType : 'blob'})
    .subscribe((data:Blob) => {
      FileSaver.saveAs(data , 'ExportData.xlsx');
    });


  }
   // Excel Export Function End // 


  // Import Excel File to the Table
  ExcelData: any;
  
  importExcel(e : any){
    const file = e.target.files[0];
    this.uploadExcelData(file);
  }

  uploadExcelData(file: File){
    let formData = new FormData();
    formData.append('file', file);
  
    this.http.post('http://localhost:8080/excel/importData', formData)
    .subscribe(
      (Response) => {
        console.log("Excel Data Uploaded Successfully: ", Response);
      },  
      (Error) => {
        console.error("Error Uploading Excel Data : " , Error);
      }
    )
  }
  
  // Import Excel File to the Table

  // Update Invoice Data 
updateInvoiceId(id: number) {
  this.router.navigate(['updateInvoice', id

]); // Corrected closing square bracket

  setTimeout(() => {
    window.location.reload();
  }, 100); 
}

  // Print Function
  generatePDF(){
    this.service.getInvoiceWithStockDetailsPDF().subscribe((data: Blob) => {
      FileSaver.saveAs(data , 'Invoice_List.pdf' )
    })
    
  }


  // Pagination
  p:number = 1;
  itemsPerPage:number = 5 
  totalRows:any;

  changeItemsPerPage(event: any) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.itemsPerPage = parseInt(value) || 5;
  }
  

  filterChange: string = ""; // Responsible for Searching Data and Filtering Data
}
