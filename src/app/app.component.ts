import { Component, OnInit } from '@angular/core';
import { MessageService  } from 'primeng/api';
import { ClipboardService } from 'ngx-clipboard';
import { environment as APIresponse } from 'src/enviroments/enviroment';
import { HttpClient  } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of,Observable } from 'rxjs';
import { RegistryService } from './services/registry.service';

const urlAPI = APIresponse.apiUrl
interface printers {
  id_printer: number;
  printer_name: string;
  printer_location: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
  
})



export class AppComponent implements OnInit{
  title = 'printer_key_assignment.front';
  loading:boolean = false;
  isLoading: boolean = false;


  
  printers: printers[] = [];
  arrayCodes: any;
  arrRegistry:any;
  duplicateRegistry:any;

  selectedPrinter: any;
  email:string = '';
  registryCode!: number;

  registry:any[] = [];

  maxSelections = 3;

  printerInput: boolean = false;
  emailInput: boolean = false;


  constructor(
    private messageService: MessageService, 
    private clipboardService: ClipboardService,
    private http: HttpClient,
    private registryService: RegistryService
    ) {}
  ngOnInit() {
    this.initGets();
      
  }
  async initGets() {
    try {
      this.isLoading = true; // Mostrar el loader
  
      await this.getPrinters();
      await this.getCodes();
      await this.getRegistry();
    } catch (error) {
      this.messageService.add({severity:'error', detail:'Error en una de las funciones:'});
    } finally {
      this.isLoading = false; // Ocultar el loader, ya sea que las funciones se completen o haya un error
    }
  }
  

  onChange(event: any) {
    
    if (this.selectedPrinter.length > this.maxSelections) {
      // Elimina el último elemento seleccionado para mantener el límite
      this.selectedPrinter.pop();
      this.messageService.add({ severity: 'info', detail: 'solo se puede seleccionar 3 impresoras como maximo' });
    }
  }
/****get metods****/

  getPrinters(){
    return new Promise<void>((resolve, reject) => {
      const url = urlAPI+'/printers';

      this.http.get<any>(url).pipe(
        tap((data) => {
          this.printers = data;
          resolve();
        }),
        catchError((error:any)=>{
          console.error(error);
          reject();
          return of(null);
        })
      ).subscribe();
    });
    

  }
  getCodes(){
    return new Promise<void>((resolve,reject)=>{

      const url = urlAPI+'/duplicateCodes';
      this.http.get<any>(url).pipe(
        tap((data) => {
          this.arrayCodes = data;
          resolve();
        }),
        catchError((error: any)=>{
          console.error(error);
          reject();
          return of(null);
        })
      ).subscribe();
    });
  }

  getRegistry(){
    return new Promise<void>((resolve,reject)=>{

      const url = urlAPI+'/duplicateRegistry';
      this.http.get<any>(url).pipe(
        tap((data) => {
          this.arrRegistry = data;
          resolve();
        }),
        catchError((error: any) => {
          console.error(error);
          reject();
          return of (null);
        })
      ).subscribe();
      
    });
  }
  


/*****POST METHODS******/


  async generateRegistry(){
    if(this.email === '' || this.selectedPrinter === undefined){
      this.errorMessage();
    }else{
      
    const code = parseInt(this.generateUniqueCode());

    this.registry = this.selectedPrinter.map((printer: printers) => ({
      code: code,
      id_printer: printer.id_printer,
      email: this.email
    }));

    if(this.duplicateRegistryCheck()){
      this.messageService.add({severity:'warn', detail:'Usuario ya existente, no se puede volver a registrar.'});
      
    } else {

      try {
      this.loading = true;
      await this.sendRegistries(); // Espera a que sendRegistries se complete antes de continuar
      this.loading = false;
      this.clipboardService.copy(code.toString());
      this.successMesage();
      this.validateInputs();
      this.clear(); 
      } catch (error) {
        this.messageService.add({ severity: 'error', detail: 'Hubo un error al registrar.' });
      }
    }
    }
  }
  successMesage(){
    this.messageService.addAll([
      { severity: 'success', detail: 'Registro exitoso' },
      { severity: 'info', detail: 'codigo copiado al portapapeles' }
    ]);
  }

  async sendRegistries() {
    return new Promise<void>((resolve, reject) =>{

      this.registryService.createRegistry(this.registry).subscribe({
        next: response => {
          console.log(response);
          this.getRegistry();
          resolve();
        
            
        },
        error: error => {
          console.error('Error al registrar', error);
          reject(error);
        }
      });
    });
  }

  /***********helper methods*************/
// Función para generar un código aleatorio de 5 dígitos
randomCode = (): string => {
  const codigoLength = 5;
  let codigo = '';

  for (let i = 0; i < codigoLength; i++) {
    const digitoAleatorio = Math.floor(Math.random() * 10); // Números aleatorios del 0 al 9
    codigo += digitoAleatorio.toString();
  }

  return codigo;
}

// Función para verificar si un código ya existe en la base de datos
codeExists = (code: string, arrayCodes: string[]): boolean => {
  return  arrayCodes.includes(code);
}

// Función para generar un código único y no duplicado
generateUniqueCode = (): string => {
  let newCode: string;

  do {
    newCode = this.randomCode();
  } while (this.codeExists(newCode, this.arrayCodes) || Number(newCode) < 3);

  return newCode;
}
duplicateRegistryCheck() {
  const unDuplicateRegistry: any[] = [];

  this.registry.forEach((reg: any) => {
    const duplicates = this.arrRegistry.filter((registro: any) => registro.id_printer === reg.id_printer && registro.email === reg.email);

    // Si hay duplicados ejecutar la siguiente validacion
    
        // Si no hay duplicados, agrega el registro a filteredRegistry
        if (duplicates.length === 0) {
          unDuplicateRegistry.push(reg);
        }
  });
  
  this.registry = unDuplicateRegistry;

return this.registry.length === 0 ?  true : false ;
 //return 'h'; 
}


errorMessage(){
  this.printerInput = this.selectedPrinter === undefined || this.selectedPrinter.length === 0;
  this.emailInput = this.email === '';
  this.messageService.add({ severity: 'error', detail: 'ingresa los datos solicitados' });
}
validateInputs(){
  this.emailInput == true ? this.emailInput=false : null;
  this.printerInput == true ? this.printerInput = false : null;
}
clear(){
  this.selectedPrinter = [];
  this.email = '';
}


}
