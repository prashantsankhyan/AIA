import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfLossRunComponent } from './list-of-loss-run.component';

describe('ListOfLossRunComponent', () => {
  let component: ListOfLossRunComponent;
  let fixture: ComponentFixture<ListOfLossRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfLossRunComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfLossRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
