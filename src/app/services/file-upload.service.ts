import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  //en este servicio se va a usar fetch de javascript, sin usar el http de Angular

  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string

  ) {

    try {
      const url = `${base_url}/upload/${tipo}/${id}`;

      const formData = new FormData();
      formData.append('imagen', archivo);

      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || '',
        },
        body: formData
      });
      const data = await resp.json();
      
      if ( data.ok ) {
        return data.nombreArchivo;
      } else {
        return false;
      }

    } catch (error) {
      console.log(error)
      return false;
    }
  }
}
