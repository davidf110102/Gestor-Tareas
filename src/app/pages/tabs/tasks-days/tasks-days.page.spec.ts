import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksDaysPage } from './tasks-days.page';

describe('TasksDaysPage', () => {
  let component: TasksDaysPage;
  let fixture: ComponentFixture<TasksDaysPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TasksDaysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
