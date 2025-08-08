import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentCategoryDialogComponent } from './parent-category-dialog.component';

describe('ParentCategoryDialogComponent', () => {
  let component: ParentCategoryDialogComponent;
  let fixture: ComponentFixture<ParentCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentCategoryDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
