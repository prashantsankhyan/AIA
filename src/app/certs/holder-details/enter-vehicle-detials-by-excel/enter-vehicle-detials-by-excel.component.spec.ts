import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterVehicleDetialsByExcelComponent } from './enter-vehicle-detials-by-excel.component';

describe('EnterVehicleDetialsByExcelComponent', () => {
  let component: EnterVehicleDetialsByExcelComponent;
  let fixture: ComponentFixture<EnterVehicleDetialsByExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterVehicleDetialsByExcelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnterVehicleDetialsByExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
