import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBorrowerManagementComponent } from './detail-borrower-management.component';

describe('DetailBorrowerManagementComponent', () => {
  let component: DetailBorrowerManagementComponent;
  let fixture: ComponentFixture<DetailBorrowerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailBorrowerManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailBorrowerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
