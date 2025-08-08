import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBorrowerManagementComponent } from './add-borrower-management.component';

describe('AddInvestorManagementComponent', () => {
  let component: AddBorrowerManagementComponent;
  let fixture: ComponentFixture<AddBorrowerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBorrowerManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBorrowerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
