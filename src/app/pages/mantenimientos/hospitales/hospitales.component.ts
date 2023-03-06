import { Component, OnInit, OnDestroy } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from '../../../services/hospital.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay, Observer, Subscription } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public hospitalestmp: Hospital[] = [];

  public cargando: boolean = false;

  private imgsubs!: Subscription;

  public termino: string = '';

  constructor(private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgsubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales()
    this.imgsubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      ).subscribe(img =>
        this.cargarHospitales()
      )
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe({
        next: (hospitales) => {
          this.hospitales = hospitales;
          this.hospitalestmp = hospitales;
          this.cargando = false;
        }
      })
  }

  guardarCambios(hospital: Hospital) {
    console.log(hospital)
    this.hospitalService.actualizarHospital(hospital._id!, hospital.nombre)
      .subscribe({
        next: resp => {
          Swal.fire('Actualizado', 'Se ha actualizado el hospital correctamente', 'success');
        }
      })
  }

  eliminarCambios(hospital: Hospital) {
    Swal.fire({
      title: '¿Borrar Hospital?',
      text: `Esta a punto de borrar el hospital ${hospital.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrar User'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.borrarHospital(hospital._id!)
          .subscribe({
            next: resp => {
              this.cargarHospitales();
              Swal.fire('Eliminado', 'Se ha Eliminado el hospital correctamente', 'success');
            }
          })
      }
    })


  }

  async abrirSwetAlert() {
    const { value = '' } = await Swal.fire<string>({
      text: 'Ingrese el nombre del nuevo Hospital',
      title: 'Crear Hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del Hospital',
      showCancelButton: true,
    })
    if (value!.trim().length > 0) {

      this.hospitalService.crearHospital(value!)
        .subscribe({
          next: (resp: any) => {
            this.hospitales.push(resp.hospital);
            Swal.fire('Creado', 'Se ha creado el hospital correctamente', 'success');
          }
        })
    }
  }

  abrirModal(hospital: Hospital) {

    this.modalImagenService.abrirModal('hospitales', hospital._id!, hospital.img);

  }

  buscarHospitales(termino: string) {
    if (termino.length === 0) {
      this.hospitales = this.hospitalestmp;
      return;
    }

    this.busquedasService.buscar('hospitales', termino)
      .subscribe({
        next: (hospitales: Hospital[]) => {
          this.hospitales = hospitales as Hospital[];
        }
      })
  }

}
