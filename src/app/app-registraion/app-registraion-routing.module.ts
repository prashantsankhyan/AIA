import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRegistraionComponent } from './app-registraion.component';

const routes: Routes = [
  {
    path:'',component:AppRegistraionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRegistraionRoutingModule { }
