import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountTeamComponent } from './account-team.component';

const routes: Routes = [
{
  path:'',component:AccountTeamComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountTeamRoutingModule { }
