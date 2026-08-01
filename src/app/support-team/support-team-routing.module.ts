import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupportTeamComponent } from './support-team.component';

const routes: Routes = [
  {
   path:'',redirectTo:'suppoerData',pathMatch:'full'
  },

  {
    path:'',component:SupportTeamComponent, children:[
      {
        path:'suppoerData',
        loadChildren:()=> import('./support-data/support-data.module').then(m=>m.SupportDataModule)
       
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportTeamRoutingModule { }
