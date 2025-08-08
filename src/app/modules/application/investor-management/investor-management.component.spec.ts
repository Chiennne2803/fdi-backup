import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorManagementComponent } from './investor-management.component';

describe('InvestorManagementComponent', () => {
  let component: InvestorManagementComponent;
  let fixture: ComponentFixture<InvestorManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestorManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
