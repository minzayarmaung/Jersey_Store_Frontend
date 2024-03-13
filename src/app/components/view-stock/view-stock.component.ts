import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { AddStockComponent } from '../add-stock/add-stock.component';
import * as FileSaver from 'file-saver';

interface User {
  id: number;
  invoiceId?: number;
  stockId?: number;
  stockName: string;
  price: number;
  quantity: number;
  amount: number;
}


@Component({
  selector: 'app-view-stock',
  templateUrl: './view-stock.component.html',
  styleUrls: ['./view-stock.component.css']
})
export class ViewStockComponent {

    // Stock Form
    stocks: any[] = [];
    // stockData: stock[] | undefined;
    stockForm!: FormGroup;
    totalAmount = 0;

  constructor(private service: DataService, private router: Router,
    private fb: FormBuilder , private renderer : Renderer2 , private el : ElementRef ,private dialog: MatDialog) { }

    // Dialog Box 
    openDialog():void{
      const  dialogRef = this.dialog.open(AddStockComponent ,{
          width: '750px',
      });
      
      dialogRef.afterClosed().subscribe((result)=>{
        console.log("The Dialog is Closed ");
        console.log(result);
      })
  
    }

    
    // Getting All Data from the Stock Database to the Stock Table
getStockData(): void {
  this.service.getStockData().subscribe( 
     (data: any) => {
       console.log(data);
       const stockResponseArray = data.stockResponse; // Accessing stockResponse property
       if (Array.isArray(stockResponseArray)) {
         this.stocks = stockResponseArray.filter(stock => stock.status == 'active');  
       } else {
         console.error("Stock data is not in the expected format:", data);
       }
     },
     (error: any) => {
       console.error("Error Getting the Data From the Database : ", error);
     }
   );
}


    // Generating PDF File 
    generatePDF(){
      this.service.getStockDataPDF().subscribe((data=>{
        FileSaver.saveAs(data , "StockList.pdf")
      }))
    }

    ngOnInit(): void {
      this.getStockData();
    }

    // Soft Delete

    softDeleteStockData(stockId: number): void{
      console.log('ID:' , stockId);
  
      // Display a confirmation dialog
      let confirmDelete = window.confirm('Are you sure you want to delete this record?');
    
      if (confirmDelete) {
        this.service.softDeleteStock(stockId).subscribe(
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
    
// Delete Permanent

//   // Delete Stock Row
// deleteStockRow(stockId: number): void {
//   this.service.deleteStockData(stockId).subscribe(
//     (data) => {
//       // Filter out the deleted stock from the stocks array
//       this.stocks = this.stocks.filter(stock => stock.stockId !== stockId);
//     },
//     (error) => {
//       console.error("Error deleting stock row:", error);
//     }
//   );

//   setTimeout(()=>{
//     window.location.reload();
//   } , 100);
// }
// // End of Delete Stock Data
// Delete Permanent

// Edit Stock Data
updateStockData(id : number){
  this.router.navigate(['updateStock', id
]);
}
// End of Edit Stock Data

// Pagination
p:number = 1;
itemsPerPage:number = 5 
totalRows:any;

filterChange: string = ""; // Responsible for Searching Data and Filtering Data
}
