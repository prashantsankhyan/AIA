import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTeamNavbarComponent } from './account-team-navbar.component';

describe('AccountTeamNavbarComponent', () => {
  let component: AccountTeamNavbarComponent;
  let fixture: ComponentFixture<AccountTeamNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountTeamNavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountTeamNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
