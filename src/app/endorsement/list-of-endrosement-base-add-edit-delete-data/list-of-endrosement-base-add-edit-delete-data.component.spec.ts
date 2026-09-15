import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfEndrosementBaseAddEditDeleteDataComponent } from './list-of-endrosement-base-add-edit-delete-data.component';

describe('ListOfEndrosementBaseAddEditDeleteDataComponent', () => {
  let component: ListOfEndrosementBaseAddEditDeleteDataComponent;
  let fixture: ComponentFixture<ListOfEndrosementBaseAddEditDeleteDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfEndrosementBaseAddEditDeleteDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfEndrosementBaseAddEditDeleteDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
