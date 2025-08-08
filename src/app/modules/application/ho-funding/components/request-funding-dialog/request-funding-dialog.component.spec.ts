import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestFundingDialogComponent } from './request-funding-dialog.component';

describe('RequestFundingDialogComponent', () => {
  let component: RequestFundingDialogComponent;
  let fixture: ComponentFixture<RequestFundingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestFundingDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestFundingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
