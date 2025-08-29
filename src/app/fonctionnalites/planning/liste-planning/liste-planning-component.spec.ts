import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePlanningComponent } from './liste-planning-component';

describe('ListePlanningComponent', () => {
  let component: ListePlanningComponent;
  let fixture: ComponentFixture<ListePlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListePlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
