import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfAdjusterComponent } from './list-of-adjuster.component';

describe('ListOfAdjusterComponent', () => {
  let component: ListOfAdjusterComponent;
  let fixture: ComponentFixture<ListOfAdjusterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfAdjusterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfAdjusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
