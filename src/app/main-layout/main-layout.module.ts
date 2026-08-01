import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from '../sharingModule/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,FormsModule,
  
    MainLayoutRoutingModule,
    RouterOutlet,
    MaterialModule,

  ]
})
export class MainLayoutModule { }
