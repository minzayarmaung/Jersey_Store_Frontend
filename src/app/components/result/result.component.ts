// result.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { HttpClient } from '@angular/common/http';


import * as XLSX from 'xlsx';

interface User {
  // Define properties based on the structure of the user data
  id: number;
  name: string;
  dateTime : string;
  date : string;
  time: string;
  status: string;
  // Add more properties as needed
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  users: User[] | undefined;
  url: string = "http://localhost:8080/";

  constructor(private service: DataService, private router: Router , private http: HttpClient) {}

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
  

  ngOnInit(): void {
    this.service.getResultTable().subscribe((data: User[]) => {

      this.users = data.filter(user => user.status !== 'inactive').map(user => ({
        ...user,  
        dateTime: `(${user.date}) ,  (${user.time})`
       

      }));
      this.totalRows = data.length;
    });
  }

  // Excel Export Function Start

  /* Default Name for Excel file when Download */
  fileName = "ExportExcelSheetFile.xlsx";

  // Export to Excel File
  exportExcel(){

    /* Passing Table ID  */
    let data = document.getElementById("table-data");

    data?.querySelectorAll("th:nth-child(6), td:nth-child(6)").forEach(cell => cell.remove());

    const ws:XLSX.WorkSheet = XLSX.utils.table_to_sheet(data)

    /* Generating workbook and add the worksheet */
    const wb : XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws, 'Sheet1')

    /* Saving to the File */
    XLSX.writeFile(wb, this.fileName)

  }
   // Excel Export Function End // 

  // Import Excel File to the Table

  ExcelData: any;

  importExcel(e : any){
    
    const file = e.target.files[0];
    let fr = new FileReader();
    
    fr.readAsArrayBuffer(file);

    fr.onload = ()=>{

      let data = fr.result;
      let workbook = XLSX.read(data , {type: 'array'});

      const sheetName = workbook.SheetNames[0];

      const sheet = workbook.Sheets[sheetName]
      
      this.ExcelData =  XLSX.utils.sheet_to_json(sheet , {raw: true})
      console.log(this.ExcelData)

    }
    
  }

  // Update Invoice Data 
updateInvoiceId(id: number) {
  this.router.navigate(['updateInvoice', id

]); // Corrected closing square bracket

  setTimeout(() => {
    window.location.reload();
  }, 100); 
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
