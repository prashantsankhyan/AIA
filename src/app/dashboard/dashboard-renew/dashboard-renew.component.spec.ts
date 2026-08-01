import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRenewComponent } from './dashboard-renew.component';

describe('DashboardRenewComponent', () => {
  let component: DashboardRenewComponent;
  let fixture: ComponentFixture<DashboardRenewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRenewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
