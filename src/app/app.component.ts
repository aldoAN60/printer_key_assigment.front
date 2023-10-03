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

  
  printers: printers[] = [];
  code: any;
  duplicateRegistry:any;

  selectedPrinter: any;
  email:string = '';

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
    this.getPrinters();
      
  }
  onChange(event: any) {
    
    if (this.selectedPrinter.length > this.maxSelections) {
      // Elimina el último elemento seleccionado para mantener el límite
      this.selectedPrinter.pop();
      this.messageService.add({ severity: 'info', detail: 'solo se puede seleccionar 3 impresoras como maximo' });
    }
  }
  randomCode = () => {
    const codigoLength = 5;
    let codigo = '';
  
    for (let i = 0; i < codigoLength; i++) {
      const digitoAleatorio = Math.floor(Math.random() * 10); // Números aleatorios del 0 al 9
      codigo += digitoAleatorio.toString();
    }
  
    return codigo;
  }

  getPrinters = () => {
    const url = urlAPI+'/printers';

    this.http.get<any>(url).pipe(
      tap((data) => {
        this.printers = data;
      }),
      catchError((error:any)=>{
        console.error(error);
        return of(null);
      })
    ).subscribe();

  }
  getCodes = () => {
    const url = urlAPI+'/duplicateCodes';
    this.http.get<any>(url).pipe(
      tap((data) => {

      }),
      catchError((error: any)=>{
        console.error(error);
        return of(null);
      })
    ).subscribe();
  }
  sendRegistries() {
    this.registryService.createRegistry(this.registry).subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.error('Error al registrar', error);
      }
    });
  }

  generateRegistry = () => {
    if(this.email === '' || this.selectedPrinter === undefined){

      this.selectedPrinter === undefined || [] ? this.printerInput = true : this.printerInput = false; 
      this.email === ''? this.emailInput = true: this.emailInput = true;
      

      this.messageService.add({ severity: 'error', detail: 'ingresa los datos solicitados' });
    }else{

    const code = parseInt(this.randomCode());
    
    this.registry = this.selectedPrinter.map((printer: printers) => ({
      code: code,
      id_printer: printer.id_printer,
      email: this.email
    }));

    this.clipboardService.copy(code.toString());
    this.messageService.addAll([
      { severity: 'success', detail: 'Registro exitoso' },
      { severity: 'info', detail: 'codigo copiado al portapapeles' }
    ]);
      this.emailInput == true ? this.emailInput=false : null;
      this.printerInput == true ? this.printerInput = false : null;
      console.log(this.registry);
      this.sendRegistries();
      
    }
  }
}
