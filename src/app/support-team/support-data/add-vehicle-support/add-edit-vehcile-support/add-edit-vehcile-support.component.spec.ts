import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVehcileSupportComponent } from './add-edit-vehcile-support.component';

describe('AddEditVehcileSupportComponent', () => {
  let component: AddEditVehcileSupportComponent;
  let fixture: ComponentFixture<AddEditVehcileSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditVehcileSupportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditVehcileSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
