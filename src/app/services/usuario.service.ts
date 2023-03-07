import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { catchError, map, tap } from "rxjs/operators";
import { environment } from '../../environments/environment';
import { loginForm } from '../interfaces/login-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

declare const google: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario!: Usuario;

  constructor(private http: HttpClient,
    private router: Router,
    private ngzone: NgZone) { }

    get token(): string {
      return localStorage.getItem('token') || '';
    }
    get uid(): string{
      return this.usuario.uid || ''
    }
    get role(): 'ADMIN_ROLE' | 'USER_ROLE'{
      return this.usuario.role!;
    }

    get headers() {
      return {
        headers: {
          'x-token': this.token
        }
      }
    }

    logout(){

      //TODO: Borrar menu
      localStorage.removeItem('token');
      localStorage.removeItem('menu');
      
      google.accounts.id.revoke('juan.d500@gmail.com', ()=>{
        this.ngzone.run(()=>{
          this.router.navigateByUrl('/login');
        })
      })
    }

    guardarStorage(token:string, menu: any){
      localStorage.setItem('token', token);
      localStorage.setItem('menu', JSON.stringify(menu));
    }

  validarToken(): Observable<boolean> {

    google.accounts.id.initialize({
      client_id: '1056346129449-nso77h33h9dhc0lm9ll3podqllerjm7a.apps.googleusercontent.com'
    });

    
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    })
      .pipe(
        map(
          (resp: any) => {
            const {nombre, email, role, google, img='', uid} = resp.usuario;
            this.usuario= new Usuario(nombre, email, '', img, google, role, uid);
            this.guardarStorage(resp.token, resp.menu);
            return true;
          }
        ),
        catchError(error => of(false))
      )
  }

  crearUsuario(formData: RegisterForm) {

    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          this.guardarStorage(resp.token, resp.menu);

        })
      );
  }

  actualizarperfil(data: {email: string, nombre: string, role: string}){
    data = {
      ...data,
      role: this.usuario.role!
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers)

  }

  login(formData: loginForm) {

    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => this.guardarStorage(resp.token, resp.menu) )
      );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => this.guardarStorage(resp.token, resp.menu))
      )
  }

  cargarUsuarios(desde: number = 0){
    const url = `${base_url}/usuarios?desde=${desde}`
    return this.http.get<CargarUsuario>(url, this.headers )
    .pipe(
      map((resp) => {
        const usuarios = resp.usuarios.map( 
          user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid));
        return {
          total: resp.paged.total,
          usuarios
        };
      })
    )
  }

  eliminarUsuario(usuario:Usuario){
    const url = `${base_url}/usuarios/${usuario.uid}`
    return this.http.delete(url, this.headers )
    
  }

  guardarUsuario(usuario: Usuario){
    
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers)

  }



}
