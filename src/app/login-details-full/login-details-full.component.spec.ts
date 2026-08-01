import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDetailsFullComponent } from './login-details-full.component';

describe('LoginDetailsFullComponent', () => {
  let component: LoginDetailsFullComponent;
  let fixture: ComponentFixture<LoginDetailsFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginDetailsFullComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginDetailsFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
