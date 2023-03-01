import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;

  constructor(private usuarioService: UsuarioService,
    private busquedaService: BusquedasService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }
  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe({
        next: ({ paged: { total }, usuarios }) => {
          this.totalUsuarios = total;
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
          this.cargando = false;

        }
      })
  }

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0
    } else if (this.desde > this.totalUsuarios) {
      this.desde -= valor
    }
    this.cargarUsuarios();
  }

  buscar(termino: string) {

    if (termino.length === 0) {
      this.usuarios = this.usuariosTemp;
      return;
    }
    this, this.busquedaService.buscar('usuarios', termino)
      .subscribe({
        next: (resultados) => {
          this.usuarios = resultados;
        }
      })
    console.log(termino)
  }


  eliminarUsuario(usuario: Usuario) {
    if (usuario.uid === this.usuarioService.uid) {
      Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
      return;
    }
    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar al usuario ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrar User'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.eliminarUsuario(usuario)
          .subscribe({
            next: resp => {
              this.cargarUsuarios();
              Swal.fire(
                'Usuario Borrado',
                `${usuario.nombre} fue eliminado correctamente`,
                'success'
              );
            }
          })

      }
    })
  }

}
