import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraVehicleDetailsComponent } from './extra-vehicle-details.component';

describe('ExtraVehicleDetailsComponent', () => {
  let component: ExtraVehicleDetailsComponent;
  let fixture: ComponentFixture<ExtraVehicleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtraVehicleDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExtraVehicleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
