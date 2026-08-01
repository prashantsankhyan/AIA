import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRegistraionComponent } from './app-registraion.component';

describe('AppRegistraionComponent', () => {
  let component: AppRegistraionComponent;
  let fixture: ComponentFixture<AppRegistraionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppRegistraionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppRegistraionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
