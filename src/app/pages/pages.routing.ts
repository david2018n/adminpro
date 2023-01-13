import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { Grafica1Component } from "./grafica1/grafica1.component";
import { PagesComponent } from "./pages.component";
import { ProgressComponent } from "./progress/progress.component";
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        children: [
            { path: '', component: DashboardComponent, data: {titulo: 'DashBoard'} },
            { path: 'progress', component: ProgressComponent, data: {titulo: 'progress'} },
            { path: 'graficas1', component: Grafica1Component, data: {titulo: 'graficas1'} },
            { path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'temas'} },
            { path: 'promesas', component: PromesasComponent, data: {titulo: 'promesas'} },
            { path: 'rxjs', component: RxjsComponent, data: {titulo: 'Rxjs'} }
            //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]

})

export class PagesRoutingModule { }