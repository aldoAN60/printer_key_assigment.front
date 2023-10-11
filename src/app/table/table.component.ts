import { Component,OnInit,ViewChild } from '@angular/core';
import { RegistryService } from '../services/registry.service';
import { Table } from 'primeng/table';
import { MessageService  } from 'primeng/api';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit{
@ViewChild('dt1') dt1!: Table; // Importante: Asegúrate de importar 'Table' desde 'primeng/table'.
registry:any;
selectedRegistry!: any;
printers:any;
isLoading:boolean = false;

  constructor(private registryService: RegistryService, private messageService: MessageService){}
  ngOnInit(): void {
  this.getInits(); 
  }

  async getInits(){
    try {
    this.isLoading = true;
    this.getPrinters(); 
    this.getRegistryTable();
    } catch (error) {
      this.messageService.add({severity:'error', detail:'Error en una de las funciones:'});
    }finally{
      this.isLoading = false;
    }
  }
  getRegistryTable(){
    
    return new Promise<void>((resolve,reject)=>{
      
      
      this.registryService.getRegistry().subscribe({
        next: response =>{
          console.log(response);
          this.registry = response;
          resolve();
        },
        error: error =>{
          console.error('error al extraer datos', error);
          reject();
        }
      });
    });
  }
  getPrinters(){
    return new Promise<void>((resolve, reject)=>{
      this.registryService.getPrinters().subscribe({
        next: response =>{
          console.log(response);
          this.printers = response;
          resolve();
        },
        error: error =>{
          console.error('error al extraer los datos', error);
          reject();
        }
      });
    });
  }

showSelectedRegistry(){
  console.log(this.selectedRegistry);
}
  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dt1.filterGlobal(filterValue, 'contains');
  }

}
