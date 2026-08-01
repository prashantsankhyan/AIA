import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimsComponent } from './claims.component';

const routes: Routes = [
  {
    path:'',redirectTo:'listOfClaims',pathMatch:'full'
  },
  {
    path:'',component:ClaimsComponent,children:[
      {
        path:'listOfClaims',
        loadChildren:()=> import('./add-edit-claims/add-edit-claims.module').then(m=>m.AddEditClaimsModule)
      },
      {
        path:'adjustorsList',
        loadChildren:()=> import('./adjustors/adjustors.module').then(m=>m.AdjustorsModule)
      },
      {
        path:'doneClaims',
        loadChildren:()=> import('./done-claims/done-claims.module').then(m=>m.DoneClaimsModule)
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimsRoutingModule { }
