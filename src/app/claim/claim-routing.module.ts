import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimComponent } from './claim.component';
import { ListOfMoveClaimComponent } from './list-of-move-claim/list-of-move-claim.component';
import { ListOfAdjusterComponent } from './list-of-adjuster/list-of-adjuster.component';

const routes: Routes = [
  {
    path:'',component:ClaimComponent
  },
  {
    path:'getMoveData',component:ListOfMoveClaimComponent
  },
  {
    path:'adjuster/:ID',component:ListOfAdjusterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimRoutingModule { }
