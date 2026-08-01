import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmericanTeamManagersComponent } from './american-team-managers.component';

describe('AmericanTeamManagersComponent', () => {
  let component: AmericanTeamManagersComponent;
  let fixture: ComponentFixture<AmericanTeamManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmericanTeamManagersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AmericanTeamManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
