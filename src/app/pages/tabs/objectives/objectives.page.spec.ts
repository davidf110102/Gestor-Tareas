import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObjectivesPage } from './objectives.page';

describe('ObjectivesPage', () => {
  let component: ObjectivesPage;
  let fixture: ComponentFixture<ObjectivesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ObjectivesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
