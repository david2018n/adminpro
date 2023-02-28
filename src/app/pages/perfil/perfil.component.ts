import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {


  public perfilForm!: FormGroup;
  public usuario: Usuario;
  public imagenSubir!: File;
  public imgTemp: any = null;

  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService) {
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    });
  }

  actualizarPerfil() {
    this.usuarioService.actualizarUsuario(this.perfilForm.value)
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          const { nombre, email } = resp.usuario;
          this.usuario.email = email;
          this.usuario.nombre = nombre;
          Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
        },
        error: (err) => {
          Swal.fire('Error', err.error.msg, 'error');
          console.log(err.error.msg);
        }
      })
  }

  cambiarImagen(file: File) {
    this.imagenSubir = file;

    if (!file) {
      this.imgTemp = null;
      this.imagenSubir!= null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;  
    }


  }

  subirimagen() {
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid!)
      .then(img => {
        this.usuario.img = img
        Swal.fire('Guardado', 'Se ha Actualizado la Imagen', 'success');
      }).catch((err)=>{
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      });
  }

}
