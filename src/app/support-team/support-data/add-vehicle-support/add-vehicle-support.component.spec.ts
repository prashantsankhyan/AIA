import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleSupportComponent } from './add-vehicle-support.component';

describe('AddVehicleSupportComponent', () => {
  let component: AddVehicleSupportComponent;
  let fixture: ComponentFixture<AddVehicleSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVehicleSupportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddVehicleSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
