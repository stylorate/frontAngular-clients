import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClientesService } from '../clientes.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  public titulo: string = "Crear Cliente";

  public errores: string[];

  constructor(private service: ClientesService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  public create(): void {
    this.service.create(this.cliente).subscribe(
      response => {
        console.log(response);
        this.router.navigate(['/clientes']);
        // swal('Nuevo cliente', `${response.message} : ${response.client.nombre}`, 'success');
        swal('Nuevo cliente', `Cliente creado con éxito : ${response.nombre}`, 'success');
      },
      err => {
        console.info(err.status);
        console.error(err.error.errors);
        this.errores = err.error.errors as string[];
      }
    )
  }

  public cargarCliente(): void {
    this.activatedRoute.params.subscribe(
      params => {
        let id = params['id'];
        if (id) {
          this.service.getCliente(id).subscribe(
            cliente => this.cliente = cliente
          )
        }
      }
    )
  }

  update(): void {
    this.service.update(this.cliente).subscribe(
      response => {
        this.router.navigate(['/clientes'])
        swal('Cliente actualizado con exito', `${response.message} : ${response.client.nombre}`, 'success')
      },
      err => {
        console.info(err.status);
        console.error(err.error.errors);
        this.errores = err.error.errors as string[];
      }
    );
  }

}
