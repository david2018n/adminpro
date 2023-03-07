import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';

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
    private medicoService: MedicoService) { }

  ngOnInit(): void {
    this.cargarHospitales()
    this.medicoForm = this.fb.group({
      nombre: ['doctor x', Validators.required],
      hospital: ['', Validators.required]
    });

    this.medicoForm.get('hospital')?.valueChanges
      .subscribe(
        hospitalId => {
          this.hospitalSeleccionado = this.hospitales.find(hosp => hosp._id === hospitalId)!
        }
      )

  }

  guardarMedico() {
    console.log(this.medicoForm.value)
    this.medicoService.crearMedico(this.medicoForm.value)
    .subscribe({
      next: resp => {
        console.log(resp)
      }
    })

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
