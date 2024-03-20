import { Component, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddStockComponent } from './components/add-stock/add-stock.component';
import { coerceStringArray } from '@angular/cdk/coercion';
import { Router } from '@angular/router';
import { DataService } from './data.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  darkModeButton(): void {
    this.service.toggleDarkMode();
  }


  title = 'store';
  
  constructor( private dialog: MatDialog, private router: Router , private service : DataService , private renderer : Renderer2){}

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }


  
}
