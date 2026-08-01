import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEndrosementStageComponent } from './add-endrosement-stage.component';

describe('AddEndrosementStageComponent', () => {
  let component: AddEndrosementStageComponent;
  let fixture: ComponentFixture<AddEndrosementStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEndrosementStageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEndrosementStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
