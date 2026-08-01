import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfAllEditByEndrosementComponent } from './list-of-all-edit-by-endrosement.component';

describe('ListOfAllEditByEndrosementComponent', () => {
  let component: ListOfAllEditByEndrosementComponent;
  let fixture: ComponentFixture<ListOfAllEditByEndrosementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfAllEditByEndrosementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfAllEditByEndrosementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
