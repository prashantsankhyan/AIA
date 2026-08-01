import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimNavBarComponent } from './claim-nav-bar.component';

describe('ClaimNavBarComponent', () => {
  let component: ClaimNavBarComponent;
  let fixture: ComponentFixture<ClaimNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClaimNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
