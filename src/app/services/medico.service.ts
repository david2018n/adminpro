import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Medico } from '../models/medico.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient) { }
  get headers() {
    return {
      headers: {
        'x-token': localStorage.getItem('token') || ''
      }
    }
  }

  cargarMedicos(): Observable<Medico[]> {
    const url = `${base_url}/medicos`
    return this.http.get<{ ok: boolean, medicos: Medico[] }>(url, this.headers)
      .pipe(
        map((resultados) => resultados.medicos)
      );
  }

  crearMedico(medico: {nombre: string, hospital: string}) {
    const url = `${base_url}/medicos`

    return this.http.post(url, medico, this.headers)
  }

  actualizarMedico(medico: Medico) {
    const url = `${base_url}/medicos/${medico._id}`

    return this.http.put(url, medico, this.headers)
  }

  borrarMedico(medico: Medico) {
    const url = `${base_url}/medicos/${medico._id}`
    return this.http.delete(url, this.headers)
  }

}
