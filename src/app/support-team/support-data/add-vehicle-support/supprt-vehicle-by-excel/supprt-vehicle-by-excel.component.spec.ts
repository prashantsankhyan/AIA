import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupprtVehicleByExcelComponent } from './supprt-vehicle-by-excel.component';

describe('SupprtVehicleByExcelComponent', () => {
  let component: SupprtVehicleByExcelComponent;
  let fixture: ComponentFixture<SupprtVehicleByExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupprtVehicleByExcelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupprtVehicleByExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
