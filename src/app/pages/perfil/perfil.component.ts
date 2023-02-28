import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from '../../services/file-upload.service';

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
    console.log(this.perfilForm.value)
    this.usuarioService.actualizarUsuario(this.perfilForm.value)
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          const { nombre, email } = resp.usuario;
          this.usuario.email = email;
          this.usuario.nombre = nombre;
        }
      })
  }

  cambiarImagen(file: File) {

    this.imagenSubir = file;

  }

  subirimagen() {
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid!)
      .then(img => this.usuario.img = img);
  }

}
