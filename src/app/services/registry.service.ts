import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistryService {
  
  private baseUrl = 'http://localhost:8000/api'; // Reemplaza con la URL de tu servidor Laravel

  constructor(private http: HttpClient) { }

  createRegistry(registryData: any) {
    const url = `${this.baseUrl}/registry-post`;
    return this.http.post(url, registryData);
  }
}
