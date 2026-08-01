import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportNavBarComponent } from './support-nav-bar.component';

describe('SupportNavBarComponent', () => {
  let component: SupportNavBarComponent;
  let fixture: ComponentFixture<SupportNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupportNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
