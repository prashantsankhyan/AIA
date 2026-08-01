import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEndorsementStageComponent } from './update-endorsement-stage.component';

describe('UpdateEndorsementStageComponent', () => {
  let component: UpdateEndorsementStageComponent;
  let fixture: ComponentFixture<UpdateEndorsementStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateEndorsementStageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateEndorsementStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
