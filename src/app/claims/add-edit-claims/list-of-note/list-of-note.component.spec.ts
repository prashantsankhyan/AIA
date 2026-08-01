import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfNoteComponent } from './list-of-note.component';

describe('ListOfNoteComponent', () => {
  let component: ListOfNoteComponent;
  let fixture: ComponentFixture<ListOfNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
