import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcoountDetailsRoutingModule } from './acoount-details-routing.module';
import { MaterialModule } from '../../sharingModule/material/material.module';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';




@NgModule({
  declarations: [
  
  ],
  imports: [
    
    CommonModule,
    AcoountDetailsRoutingModule,
    HttpClientModule,
    RouterOutlet,
    MaterialModule,
    
    
   
  ],
})
export class AcoountDetailsModule { }
