import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertsViewTruckDriverComponent } from './certs-view-truck-driver.component';

describe('CertsViewTruckDriverComponent', () => {
  let component: CertsViewTruckDriverComponent;
  let fixture: ComponentFixture<CertsViewTruckDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertsViewTruckDriverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertsViewTruckDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
