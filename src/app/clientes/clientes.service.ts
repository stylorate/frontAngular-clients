import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private url: string = "http://localhost:8080/api/clients";

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient,
    private router: Router) { }


  // CARGA Y LECTURA DE ARCHIVO JSON
  // getClientes(): Observable<Cliente[]> {
  //   return of(CLIENTES);
  // }

  //FORMA DIRECTA
  // getClientes(): Observable<Cliente[]> {
  //   return this.http.get<Cliente[]>(this.url);
  // }

  // FORMA CON MAP Y OBTENIENDO EL LIST SIN PAGINACIÓN
  // getClientes(): Observable<Cliente[]> {
  //   return this.http.get(this.url).pipe(
  //     map(response => {
  //       let clientes = response as Cliente[];
  //       return clientes.map(
  //         cliente => {
  //           cliente.nombre = cliente.nombre.toUpperCase();
  //           // cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
  //           // let datePipe = new DatePipe('es');
  //           // cliente.createAt = datePipe.transform(cliente.createAt, 'fullDate');
  //           // cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM, yyyy');
  //           // cliente.createAt = datePipe.transform(cliente.createAt, 'dd/MM/yyyy');
  //           return cliente;
  //         }
  //       );
  //     })
  //
  //   );
  // }

  // FORMA CON PAGINACIÓN
  getClientes(page: number): Observable<any> {
    return this.http.get(this.url + '/page/' + page).pipe(
      map((response: any) => {
        (response.content as Cliente[]).map(
          cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
            return cliente;
          });
        return response;
      })

    );
  }

  // create(cliente: Cliente): Observable<any> {
  //   return this.http.post<any>(this.url, cliente, { headers: this.httpHeaders }).pipe(
  // return this.http.post<Cliente>(this.url, cliente, { headers: this.httpHeaders }).pipe(
  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.url, cliente, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.client as Cliente),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }

        console.error(e.error.message);
        swal(e.error.message, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.message);
        swal(e.error.message, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.url}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }

        console.error(e.error.message);
        swal(e.error.message, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.message);
        swal(e.error.message, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
