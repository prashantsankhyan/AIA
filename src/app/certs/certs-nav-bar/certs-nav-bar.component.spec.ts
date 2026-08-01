import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertsNavBarComponent } from './certs-nav-bar.component';

describe('CertsNavBarComponent', () => {
  let component: CertsNavBarComponent;
  let fixture: ComponentFixture<CertsNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertsNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertsNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
