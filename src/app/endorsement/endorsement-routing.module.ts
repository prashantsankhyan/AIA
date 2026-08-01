import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EndorsementComponent } from './endorsement.component';
import { ListOfEndrosementComponent } from '../policy/list-of-endrosement/list-of-endrosement.component';
import { ListOfPolicyForEndrosementComponent } from './list-of-policy-for-endrosement/list-of-policy-for-endrosement.component';

const routes: Routes = [
  {
    path:'',redirectTo:'listOfPolicyForEndrosement',pathMatch:'full'
  },

  {
    path:'',component:EndorsementComponent,children:[
      {
       path:'listOfPolicyForEndrosement',component:ListOfPolicyForEndrosementComponent
      },
      {
        path:'endrosementDetail',
        loadChildren:()=> import('./endrosement-details/endrosement-details.module').then(m=>m.EndrosementDetailsModule)
      },
      {
        path:'attachementEndro',
        loadChildren:()=> import('./endrosement-attachment/endrosement-attachment.module').then(m=>m.EndrosementAttachmentModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EndorsementRoutingModule { }
