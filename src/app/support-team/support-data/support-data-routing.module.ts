import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupportDataComponent } from './support-data.component';

const routes: Routes = [

  {

    path:'',redirectTo:'attaachementSupport',pathMatch:'full'

  },

  {
    path:'',component:SupportDataComponent,children:[
      {
        path:'DriverSupport',
        loadChildren:()=> import('./add-driver-for-support/add-driver-for-support.module').then(m=>m.AddDriverForSupportModule)
      },
      {
        path:'vehicleSupport',
        loadChildren:()=> import('./add-vehicle-support/add-vehicle-support.module').then(m=>m.AddVehicleSupportModule)
      },
      {
         path:'attaachementSupport',
        loadChildren:()=> import('./attachement-of-support/attachement-of-support.module').then(m=>m.AttachementOfSupportModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportDataRoutingModule { }
