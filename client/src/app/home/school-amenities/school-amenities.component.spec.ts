import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAmenitiesComponent } from './school-amenities.component';

describe('SchoolAmenitiesComponent', () => {
  let component: SchoolAmenitiesComponent;
  let fixture: ComponentFixture<SchoolAmenitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolAmenitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
