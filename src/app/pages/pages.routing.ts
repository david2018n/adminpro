import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { Grafica1Component } from "./grafica1/grafica1.component";
import { PagesComponent } from "./pages.component";
import { ProgressComponent } from "./progress/progress.component";
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AuthGuard } from '../guards/auth.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DashboardComponent, data: {titulo: 'DashBoard'} },
            { path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'temas'} },
            { path: 'graficas1', component: Grafica1Component, data: {titulo: 'graficas1'} },
            { path: 'progress', component: ProgressComponent, data: {titulo: 'progress'} },
            { path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil de usuario'} },
            { path: 'promesas', component: PromesasComponent, data: {titulo: 'promesas'} },
            { path: 'rxjs', component: RxjsComponent, data: {titulo: 'Rxjs'} },

            // Mantenimientos
            { path: 'usuarios', component: UsuariosComponent, data: {titulo: 'Mantenimiento de Usuarios'} },
            { path: 'hospitales', component: HospitalesComponent, data: {titulo: 'Mantenimiento de Hospitales'} },
            { path: 'medicos', component: MedicosComponent, data: {titulo: 'Mantenimiento de Medicos'} },
            { path: 'medicos/:id', component: MedicoComponent, data: {titulo: 'Mantenimiento de Medicos'} },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]

})

export class PagesRoutingModule { }