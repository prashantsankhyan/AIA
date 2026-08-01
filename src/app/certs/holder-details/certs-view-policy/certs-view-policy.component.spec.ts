import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertsViewPolicyComponent } from './certs-view-policy.component';

describe('CertsViewPolicyComponent', () => {
  let component: CertsViewPolicyComponent;
  let fixture: ComponentFixture<CertsViewPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertsViewPolicyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertsViewPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
