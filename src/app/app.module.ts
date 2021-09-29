import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TreeGridComponent } from './components/tree-grid/tree-grid.component';

import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { PageService, SortService, FilterService } from '@syncfusion/ej2-angular-treegrid';
@NgModule({
  declarations: [
    AppComponent,
    TreeGridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TreeGridModule,
    HttpClientModule
  ],
  providers: [
    PageService,
    SortService,
    FilterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
