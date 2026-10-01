import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEdirMiscellanesousComponent } from './add-edir-miscellanesous.component';

describe('AddEdirMiscellanesousComponent', () => {
  let component: AddEdirMiscellanesousComponent;
  let fixture: ComponentFixture<AddEdirMiscellanesousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEdirMiscellanesousComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEdirMiscellanesousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
