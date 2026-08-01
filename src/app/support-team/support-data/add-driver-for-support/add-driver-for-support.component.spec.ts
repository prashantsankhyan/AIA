import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDriverForSupportComponent } from './add-driver-for-support.component';

describe('AddDriverForSupportComponent', () => {
  let component: AddDriverForSupportComponent;
  let fixture: ComponentFixture<AddDriverForSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDriverForSupportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDriverForSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
