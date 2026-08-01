import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBrokerComponent } from './add-edit-broker.component';

describe('AddEditBrokerComponent', () => {
  let component: AddEditBrokerComponent;
  let fixture: ComponentFixture<AddEditBrokerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditBrokerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditBrokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
