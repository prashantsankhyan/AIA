import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSaleTeamNoteComponent } from './delete-sale-team-note.component';

describe('DeleteSaleTeamNoteComponent', () => {
  let component: DeleteSaleTeamNoteComponent;
  let fixture: ComponentFixture<DeleteSaleTeamNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSaleTeamNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteSaleTeamNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
