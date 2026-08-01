import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from './template/template.component';
import { AigComponent } from './aig/aig.component';
import { AlMtrustComponent } from './al-mtrust/al-mtrust.component';
import { MTrustComponent } from './m-trust/m-trust.component';
import { SmallMtrustComponent } from './small-mtrust/small-mtrust.component';
import { AmericanTeamManagersComponent } from './american-team-managers/american-team-managers.component';
import { GenericComponent } from './generic/generic.component';
import { ListOfDataComponent } from './list-of-data/list-of-data.component';
import { TruckersGeneralLiabilityComponent } from './truckers-general-liability/truckers-general-liability.component';
import { TransgardComponent } from './transgard/transgard.component';
import { ZKnightDierctComponent } from './z-knight-dierct/z-knight-dierct.component';
import { DBComponent } from './db/db.component';

const routes: Routes = [
  {
    path:'',component:TemplateComponent,children:[
      {
        path:'aig',component:AigComponent
      },
      {
        path:'amTrust',component:MTrustComponent
      },
      {
        path:'alMtrust',component:AlMtrustComponent
      },
      {
        path:'small',component:SmallMtrustComponent
      },
      {
        path:'generic',component:GenericComponent
      },
      {
        path:'teamManger',component:AmericanTeamManagersComponent
      },
      {
        path:'listOfData',component:ListOfDataComponent
      },
      {
        path:'trucker',component:TruckersGeneralLiabilityComponent
      },
      {
        path:'transgard',component:TransgardComponent
      },
       {
        path:'knight',component:ZKnightDierctComponent
      },
       {
        path:'db',component:DBComponent
      }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TempalteRoutingModule { }
