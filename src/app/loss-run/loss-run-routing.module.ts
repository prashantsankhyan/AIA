import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LossRunComponent } from './loss-run.component';
import { ListOfRenewPolicyForLossRunComponent } from './list-of-renew-policy-for-loss-run/list-of-renew-policy-for-loss-run.component';

const routes: Routes = [
  {
   path:'',redirectTo:'lossRun',pathMatch:'full'
  }, 
  {
    path:'',component:LossRunComponent,children:[{
      
        path:'lossRun',
        loadChildren:()=> import('./list-of-loss-run/list-of-loss-run.module').then(m=>m.ListOfLossRunModule)
      
    },

    {
      path:'renew',component:ListOfRenewPolicyForLossRunComponent
     }, 
  
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LossRunRoutingModule { }
