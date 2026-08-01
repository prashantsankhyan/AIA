import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfEndrosementComponent } from './list-of-endrosement.component';

describe('ListOfEndrosementComponent', () => {
  let component: ListOfEndrosementComponent;
  let fixture: ComponentFixture<ListOfEndrosementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfEndrosementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfEndrosementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
