import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarEndorsementComponent } from './navbar-endorsement.component';

describe('NavbarEndorsementComponent', () => {
  let component: NavbarEndorsementComponent;
  let fixture: ComponentFixture<NavbarEndorsementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarEndorsementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarEndorsementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
