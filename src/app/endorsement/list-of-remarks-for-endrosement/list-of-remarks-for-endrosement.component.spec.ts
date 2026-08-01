import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfRemarksForEndrosementComponent } from './list-of-remarks-for-endrosement.component';

describe('ListOfRemarksForEndrosementComponent', () => {
  let component: ListOfRemarksForEndrosementComponent;
  let fixture: ComponentFixture<ListOfRemarksForEndrosementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfRemarksForEndrosementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfRemarksForEndrosementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
