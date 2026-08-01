import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfMoveClaimComponent } from './list-of-move-claim.component';

describe('ListOfMoveClaimComponent', () => {
  let component: ListOfMoveClaimComponent;
  let fixture: ComponentFixture<ListOfMoveClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfMoveClaimComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfMoveClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
