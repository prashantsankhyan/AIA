import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginDetailsComponent } from './login-details.component';

const routes: Routes = [
  {
    path:'',component:LoginDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginDetailsRoutingModule { }
