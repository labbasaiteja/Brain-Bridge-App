import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssistantshipsComponent } from './view-assistantships.component';

describe('ViewAssistantshipsComponent', () => {
  let component: ViewAssistantshipsComponent;
  let fixture: ComponentFixture<ViewAssistantshipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAssistantshipsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAssistantshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
