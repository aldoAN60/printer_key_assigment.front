import { Component,OnInit } from '@angular/core';
import { RegistryService } from '../services/registry.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit{
registry:any;
  constructor(private registryService: RegistryService){}
  ngOnInit(): void {
    this.getRegistryTable();
  }
  
  async getRegistryTable(){
    return new Promise<void>((resolve,reject)=>{
  
      this.registryService.getRegistry().subscribe({
        next: response =>{
          console.log(response);
          this.registry = response;
          resolve();
        },
        error: error =>{
          console.error('error al extraer datos', error);
          reject(error);
        }
      });
    });
  }
}
