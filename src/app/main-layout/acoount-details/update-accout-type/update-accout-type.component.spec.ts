import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAccoutTypeComponent } from './update-accout-type.component';

describe('UpdateAccoutTypeComponent', () => {
  let component: UpdateAccoutTypeComponent;
  let fixture: ComponentFixture<UpdateAccoutTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAccoutTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateAccoutTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
