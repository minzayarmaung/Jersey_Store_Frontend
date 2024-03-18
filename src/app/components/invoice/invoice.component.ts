import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service'; 
import { InvoiceData } from '../invoice-data/invoicedata.module'; 
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddStockComponent } from '../add-stock/add-stock.component';
import { StockData } from '../stock-data/stockdata.module';
import { NgZone } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Time } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

// Validation to Check
function invoiceIDValidator(control: AbstractControl) : ValidationErrors | null{
  const value = control.value;

  if(isNaN(value)){
    return { 'notANumber' : true};
  }

  return null;
}


interface Invoice {
  invoiceId: any;
  cashierName: string;
  branch: string;
  date: string;
  time: string; // Define time as string
  center: string;
  status: string;
}
interface StockDetails {
  name: string;
  quantity: number;
  price: number;
  // Add any other properties if necessary
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  @ViewChild('tbody') tbody!: ElementRef;

  // Stock Form
  stocks: any[] = [];
 // stockData: stock[] | undefined;
  stockForm!: FormGroup;
  totalAmount = 0;

  availableStockIds: any[] = [];

    constructor(private service: DataService, private router: Router,
     private fb: FormBuilder , private renderer : Renderer2 , private el : ElementRef ,private dialog: MatDialog,
     private cdr: ChangeDetectorRef , private zone: NgZone , private sanitizer: DomSanitizer) { }

    imageSrc = "https://cdn3d.iconscout.com/3d/premium/thumb/upload-image-9298307-7628612.png";
    imageSelected : boolean = false;
    showEdit: boolean = false;

    onFileSelected(event :any): void{
      if(event.target.files && event.target.files[0]){
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.zone.run(() => {
            this.imageSrc = reader.result as string;
            
          });
        };
        reader.readAsDataURL(file);
        this.imageSelected = true;
      }
    }
    onImageLoad(){
      console.log("profileImage has Loaded ! ")
    }


     // Get Current Time
     getCurrentTime(): string{
      const now = new Date();
      const hours = ('0' + now.getHours()).slice(-2);
      const minutes = ('0' + now.getMinutes()).slice(-2);
      return `${hours}:${minutes}`;
     }

   data: any;

   form = new FormGroup({
      invoiceId: new FormControl('', [Validators.required , invoiceIDValidator]),
      cashierName: new FormControl('', Validators.required),
      branch: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      time: new FormControl(this.getCurrentTime() , Validators.required),
      center: new FormControl('', Validators.required),
      status : new FormControl(''),
      profileImage : new FormControl('')
    });

    // Getting Available Stock Ids
    ngOnInit(): void {
      this.stockForm = this.fb.group({
        items: this.fb.array([this.createItem()])
      });

      this.stockForm.valueChanges.subscribe(value => {
        this.totalAmount = value.items.reduce((total: number, item: any) => total + (item.quantity * item.price));
      });

      this.service.getAvailableStockIds().subscribe((response: any) => {
        console.log(response);
        this.availableStockIds = response.map((stock: any) => stock.stockId);
      });
    }


  createItem(): FormGroup {
    return this.fb.group({
      stockId: ['', Validators.required], 
      name: ['', Validators.required], 
      price: ['', Validators.required], 
      quantity: ['', Validators.required], 
      invoiceId: ['', Validators.required],
      amount : this.fb.control({value: '', disabled: false})
    });
  }

  // Populated Stock Info
  populateStockInfo(selectedValue: any, stock: any): void {
    const selectedStock = this.stocks.find((s: any) => s.stockId == selectedValue);
    if (selectedStock && stock) {
      stock.name = selectedStock.name;
      stock.quantity = selectedStock.quantity;
      stock.price = selectedStock.price;
    }
  }

  onChange(event: Event, stock: any): void {
    const selectedValue: number = parseInt((event.target as HTMLSelectElement)?.value);
    if (!isNaN(selectedValue)) {
      this.service.getStockDataById(selectedValue).subscribe((stockData: StockData) => {
        if (stockData && stock) {
          stock.name = stockData.name;
          stock.quantity = stockData.quantity;
          stock.price = stockData.price;
        }
      });
    }
  }

  // Dynamic Row Adding 

    addRow(){
      this.stocks.push({ name : '', quantity : 1 , price: 1})
    }

    removeRow(index: number){
      this.stocks.splice(index, 1);
    }

    calculateAmount(stock: any): number {
      return stock.quantity * stock.price;
    }
    
    
    calculateTotal(): number {
      let total = 0;
      for (let stock of this.stocks) {
        total += this.calculateAmount(stock);
      }
      return total;
    }
    
  // Dynamic Row Adding 

 // Saving Data 

 saveData(): void {
  let confirmSave = window.confirm("Are you sure you want to Save this data?");
  
  if (confirmSave) {
    const formData = new FormData();
    const invoice: Invoice = {
      invoiceId: this.form.value.invoiceId,
      cashierName: this.form.value.cashierName || '',
      branch: this.form.value.branch || '',
      date: this.form.value.date || '',
      time: this.form.value.time || '',
      center: this.form.value.center || '',
      status: 'active' 
    };
    formData.append('invoiceAndStocks', JSON.stringify({ invoice, stocks: this.stocks }));

    // Appending the File if it is selected
    const fileInput: HTMLInputElement = this.el.nativeElement.querySelector('#fileInput');
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      console.log("Image Data : " , fileInput.files[0]);
      formData.append('profileImage', fileInput.files[0]);
    }

    const stocks = this.stocks.map((stock: any) => ({
      name: stock.name,
      quantity: stock.quantity,
      price: stock.price
    }));

    formData.append('stocks', JSON.stringify(stocks));

    console.log("Invoice Data :", invoice);
    console.log("Stock Data : ", stocks);
    console.log("Form Data:", this.form.value);

    // Log FormData to check if image is appended correctly
    console.log("FormData:", formData);

    this.service.addInvoiceAndStockData(formData).subscribe(response => {
      console.log(response);
      alert(" DATA SAVED SUCCESSFULLY !")
      window.location.reload();
    }, error => {
      console.error("Error Saving invoice and stock data :", error);
      alert("ERROR SAVING DATA !!")
    })
  } 
}



// Delete Stock Row

deleteStockRow(stockId: number): void {
  this.service.deleteStockData(stockId).subscribe(
    (data) => {
      // Filter out the deleted stock from the stocks array
      this.stocks = this.stocks.filter(stock => stock.stockId !== stockId);
    },
    (error) => {
      console.error("Error deleting stock row:", error);
    }
  );

  setTimeout(()=>{
    window.location.reload();
  } , 100);
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

}
