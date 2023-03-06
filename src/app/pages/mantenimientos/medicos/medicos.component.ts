import { Component, OnInit, OnDestroy } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription, delay } from 'rxjs';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {
  public cargando: boolean = true;

  public imgSubs!: Subscription

  public medicos: Medico[] = [];
  public medicostmp: Medico[] = [];

  constructor(private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarmedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(150)
      )
      .subscribe(img => this.cargarmedicos())
  }

  cargarmedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe({
        next: medicos => {
          this.medicos = medicos;
          this.medicostmp = medicos;
          this.cargando = false;
        }
      })
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);

  }

  eliminarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Borrar Medico?',
      text: `Esta a punto de borrar el Medico ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrar User'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico)
          .subscribe({
            next: resp => {
              this.cargarmedicos();
              Swal.fire('Eliminado', 'Se ha Eliminado el hospital correctamente', 'success');
            }
          })
      }
    })
  }
  async abrirSwetAlert(medico: string) {
    const { value = '' } = await Swal.fire<string>({
      text: 'Ingrese el nombre del nuevo Hospital',
      title: 'Crear Hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del Hospital',
      showCancelButton: true,
    })
    if (value!.trim().length > 0) {

      this.medicoService.crearMedico(medico)
        .subscribe({
          next: (resp: any) => {
            this.medicos.push(resp.medico);
            Swal.fire('Creado', 'Se ha creado el hospital correctamente', 'success');
          }
        })
    }
  }

  buscar(termino: string) {

    if (termino.length === 0) {
      this.medicos = this.medicostmp;
      return;
    }

    this.busquedasService.buscar('medicos', termino)
    .subscribe({
      next: medicos => {
        this.medicos = medicos as Medico[];
      }
    }

    )

  }

}