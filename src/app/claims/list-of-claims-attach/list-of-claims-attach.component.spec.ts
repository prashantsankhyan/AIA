import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfClaimsAttachComponent } from './list-of-claims-attach.component';

describe('ListOfClaimsAttachComponent', () => {
  let component: ListOfClaimsAttachComponent;
  let fixture: ComponentFixture<ListOfClaimsAttachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfClaimsAttachComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfClaimsAttachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
