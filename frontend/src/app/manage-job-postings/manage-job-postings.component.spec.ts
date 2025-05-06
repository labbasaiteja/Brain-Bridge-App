import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJobPostingsComponent } from './manage-job-postings.component';

describe('ManageJobPostingsComponent', () => {
  let component: ManageJobPostingsComponent;
  let fixture: ComponentFixture<ManageJobPostingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageJobPostingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageJobPostingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
