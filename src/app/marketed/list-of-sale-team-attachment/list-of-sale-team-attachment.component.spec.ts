import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfSaleTeamAttachmentComponent } from './list-of-sale-team-attachment.component';

describe('ListOfSaleTeamAttachmentComponent', () => {
  let component: ListOfSaleTeamAttachmentComponent;
  let fixture: ComponentFixture<ListOfSaleTeamAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfSaleTeamAttachmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfSaleTeamAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
