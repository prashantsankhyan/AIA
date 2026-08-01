import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertForLoginComponent } from './alert-for-login.component';

describe('AlertForLoginComponent', () => {
  let component: AlertForLoginComponent;
  let fixture: ComponentFixture<AlertForLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertForLoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlertForLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
