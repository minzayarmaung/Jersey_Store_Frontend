// result.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { HttpClientModule, HttpClient, HttpParams } from '@angular/common/http';
import * as FileSaver from 'file-saver';

interface User {
  invoiceId: number;
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
interface InvoiceAndStockDataResponse{
  invoiceId: number;
  cashierName: string;
  date: string;
  time: string;
  branch: string;
  center: string;
  stockId: number;
  name: string;
  amount: number;
}

interface PaginationResponse{
  items : InvoiceAndStockDataResponse[];
  totalCount : number;
  totalPages : number ;
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  users: User[] | undefined;
  totalCount: number = 0;
  totalPages: number = 0;
  data : InvoiceAndStockDataResponse[] = [];
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
    this.service.getInvoiceWithStockDetails().subscribe((data: any) => {
      console.log('Data received:', data);
      const dataArray = data; // Assuming 'data' is the array you logged
      console.log('Is dataArray an array?', Array.isArray(dataArray));
      console.log('Length of dataArray:', dataArray.length);
  
      if (Array.isArray(dataArray)) {
        this.users = dataArray.reduce((acc: any[], curr: any) => {
          if (!acc.find((item: any) => item.invoiceId === curr.invoiceId) && curr.status == 'active') {
            acc.push(curr);
          }
          return acc;
        }, []);
        // Assuming you want to do something with uniqueInvoices here
        console.log('Unique Invoices:', this.users);
      } else {
        console.error('dataArray is not an array:', dataArray);
      }
    });

    this.loadData();
  }

  // Excel Export Function Start
  /* Default Name for Excel file when Download */
  fileName = "ExportExcelSheetFile.xlsx";

  // Export to Excel File
  exportExcel(page: number = 0, limit: number = 100, searchValue: string = this.search): void{
    let params = new HttpParams()
    .set('page', page.toString())
    .set('limit' , limit.toString())
    .set('search' , searchValue);

    console.log(`Exporting with parameters - Page: ${page}, Limit: ${limit}, SearchValue: '${searchValue}'`);

    let url = 'http://localhost:8080/storesystem/store/excel/exportFile';

    this.http.get(`${url}?${params.toString()}`, {
        responseType : 'blob'
    })
    .subscribe((data:Blob) => {
      FileSaver.saveAs(data , 'ExportData.xlsx');
    });
  }
   // Excel Export Function End // 


  // Import Excel File to the Table
  ExcelData: any;
  uploading: boolean = false;
  uploadSuccess: boolean = false;
  uploadError: boolean = false;
  
  importExcel(e : any){
    const file = e.target.files[0];
    const confirmImport = window.confirm("Are you sure you want to import data from this file?");
    if(confirmImport){
    this.uploadExcelData(file);
  }
}

  uploadExcelData(file: File){
    this.uploading = true;
    let formData = new FormData();
    formData.append('file', file);
  
    this.http.post('http://localhost:8080/storesystem/store/import', formData)
    .subscribe(
      (Response) => {
        console.log("Excel Data Uploaded Successfully: ", Response);
        this.uploading = false;
        this.uploadSuccess = true;
        alert("Success Importing Excel Data ✔ .")     
      },  
      (Error) => {
        console.error("Error Uploading Excel Data : " , Error);
        this.uploading = false;
        this.uploadError = true;
        alert("Failed Importing Excel Data ❌ . Please check your Excel File. ")
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
  loadData(){
    const page = this.pageNo;
    const limit = this.itemsPerPage;
    const searchValue = this.search;

    console.log('Loding data for Page :' , page , 'and limit: ' , limit);

    this.service.paginationControl(page , limit , searchValue).subscribe(
      (response : PaginationResponse) => {
        console.log("Response From API : " , response);
        this.data = response.items;
        this.totalRows= response.totalCount;
      },
      (error) => {
        console.error("Error Changing Another Page and Getting Data From the Backend" , error);
      }
    );
  }

  // Check Page Changes
  logChanges(event: any){
    console.log('Page changed to:', event);
    this.pageNo = event;
    this.loadData();
  }

  // Pagination
  pageNo:number = 1;
  itemsPerPage:number = 5 
  totalRows:any;

  changeItemsPerPage(event: any) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.itemsPerPage = parseInt(value) || 5;
    this.loadData();
  }

  // Search Data 
  searchData(){
    this.service.paginationControl(0 , 5  , this.search).subscribe(data => {
      console.log("Searching Data : " , data);
      if(data && data.items){
        this.data = data.items;
        this.totalCount = data.totalCount;
        this.totalPages = data.totalPages
      }
    },error => {
      console.log("Error Searching Data :" , error);
    });
  }
  
  search : string = ""; // Responsible for Searching Data and Filtering Data
}