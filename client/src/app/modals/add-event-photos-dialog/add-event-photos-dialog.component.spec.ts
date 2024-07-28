import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventPhotosDialogComponent } from './add-event-photos-dialog.component';

describe('AddEventPhotosDialogComponent', () => {
  let component: AddEventPhotosDialogComponent;
  let fixture: ComponentFixture<AddEventPhotosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventPhotosDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEventPhotosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
