import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMarketdComponent } from './add-edit-marketd.component';

describe('AddEditMarketdComponent', () => {
  let component: AddEditMarketdComponent;
  let fixture: ComponentFixture<AddEditMarketdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditMarketdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditMarketdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
