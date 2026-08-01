import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNavBarClaimsComponent } from './main-nav-bar-claims.component';

describe('MainNavBarClaimsComponent', () => {
  let component: MainNavBarClaimsComponent;
  let fixture: ComponentFixture<MainNavBarClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainNavBarClaimsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainNavBarClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
