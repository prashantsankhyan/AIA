import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSummarayComponent } from './client-summaray.component';

describe('ClientSummarayComponent', () => {
  let component: ClientSummarayComponent;
  let fixture: ComponentFixture<ClientSummarayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSummarayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientSummarayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
