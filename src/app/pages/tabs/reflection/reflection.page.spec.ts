import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReflectionPage } from './reflection.page';

describe('ReflectionPage', () => {
  let component: ReflectionPage;
  let fixture: ComponentFixture<ReflectionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReflectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
