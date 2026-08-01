import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceAllVehicleComponent } from './replace-all-vehicle.component';

describe('ReplaceAllVehicleComponent', () => {
  let component: ReplaceAllVehicleComponent;
  let fixture: ComponentFixture<ReplaceAllVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplaceAllVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReplaceAllVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
