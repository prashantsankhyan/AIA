import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneItComponent } from './done-it.component';

describe('DoneItComponent', () => {
  let component: DoneItComponent;
  let fixture: ComponentFixture<DoneItComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoneItComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoneItComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
