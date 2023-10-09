import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService  } from 'primeng/api';
import { ClipboardModule } from 'ngx-clipboard'; 
import { HttpClientModule } from '@angular/common/http';
import { TableComponent } from './table/table.component';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    RadioButtonModule,
    CardModule,
    MultiSelectModule,
    FormsModule,
    ToastModule,
    ClipboardModule,
    HttpClientModule,
    TableModule
    

  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
