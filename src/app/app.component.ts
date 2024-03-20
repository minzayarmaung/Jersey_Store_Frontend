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

  title = 'store';
  
  constructor( private dialog: MatDialog, private router: Router , private service : DataService , private renderer : Renderer2 ,
    ){}

  ngOnInit(): void {
      const darkMode = localStorage.getItem('darkMode');
      if (darkMode) {
        this.service.isDarkMode = JSON.parse(darkMode);
      }
      this.applyTheme();
    }
  darkModeButton(): void {
    this.service.toggleDarkMode();
    this.applyTheme();
  }
  isDarkModeEnabled(): boolean {
    return this.service.isDarkMode;
  }
  
  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }

  private applyTheme(): void{
    if(this.isDarkModeEnabled()){
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
  
}
