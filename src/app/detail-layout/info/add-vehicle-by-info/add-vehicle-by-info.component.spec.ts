import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleByInfoComponent } from './add-vehicle-by-info.component';

describe('AddVehicleByInfoComponent', () => {
  let component: AddVehicleByInfoComponent;
  let fixture: ComponentFixture<AddVehicleByInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVehicleByInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddVehicleByInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
