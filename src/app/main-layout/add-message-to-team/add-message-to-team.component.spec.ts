import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMessageToTeamComponent } from './add-message-to-team.component';

describe('AddMessageToTeamComponent', () => {
  let component: AddMessageToTeamComponent;
  let fixture: ComponentFixture<AddMessageToTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMessageToTeamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddMessageToTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
