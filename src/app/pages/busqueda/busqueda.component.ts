import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusquedasService } from '../../services/busquedas.service';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {
  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];

  constructor(private activateRouter: ActivatedRoute,
    private busquedaService: BusquedasService) { }

  ngOnInit(): void {
    this.activateRouter.params
    .subscribe(({termino}) => this.busquedaGlobal(termino))
  }

  busquedaGlobal(termino: string){
    this.busquedaService.busquedaGlobal(termino)
    .subscribe({
      next: (resp: any) => {
        this.medicos = resp.medicos;
        this.hospitales = resp.hospitales;
        this.usuarios = resp.usuarios;
      }
    })
  }

  abrirMedico(medico: Medico){
    console.log(medico)
  }

}
