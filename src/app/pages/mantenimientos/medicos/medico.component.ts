import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import Swal from 'sweetalert2';
import { delay } from 'rxjs';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {
  public hospitales: Hospital[] = [];

  public medicoForm!: FormGroup;

  public hospitalSeleccionado!: Hospital;
  public medicoSeleccionado!: Medico;

  constructor(private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedicoPorId(id));


    this.cargarHospitales();

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    this.medicoForm.get('hospital')?.valueChanges
      .subscribe(
        hospitalId => {
          this.hospitalSeleccionado = this.hospitales.find(hosp => hosp._id === hospitalId)!
        }
      )
  }

  cargarMedicoPorId(id: string) {
    if (id === 'nuevo') {
      return;
    }
    this.medicoService.obtenerMedicoPorId(id)
    .pipe(
      delay(120)
    )
      .subscribe({
        next: (medico) => {
        if ( !medico) {
          this.router.navigate(['/dashboard', 'medicos']);
          return;
        }

        const nombre = medico.nombre;
        const id = medico.hospital?._id
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({ nombre, hospital: id })

      },
    error: (err) => {
      this.router.navigate(['/dashboard', 'medicos']);
    }})
  }

  guardarMedico() {


    const { nombre } = this.medicoForm.value;
    if (this.medicoSeleccionado) {

      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data)
        .subscribe({
          next: resp => {
            Swal.fire('Actualizado', `${nombre} Se ha Actualizado correctamente`, 'success');
          }
        })
    } else {
      this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe({
          next: (resp: any) => {
            console.log(resp);
            Swal.fire('Creado', `${nombre} Se ha creado correctamente`, 'success');
            this.router.navigate(['/dashboard', 'medicos', resp.medico._id])
          }
        })

    }
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe({
        next: (hospitales: Hospital[]) => {
          this.hospitales = hospitales
        }
      })
  }

}
