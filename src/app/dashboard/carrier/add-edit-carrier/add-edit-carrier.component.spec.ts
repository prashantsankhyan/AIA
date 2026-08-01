import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCarrierComponent } from './add-edit-carrier.component';

describe('AddEditCarrierComponent', () => {
  let component: AddEditCarrierComponent;
  let fixture: ComponentFixture<AddEditCarrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCarrierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditCarrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
