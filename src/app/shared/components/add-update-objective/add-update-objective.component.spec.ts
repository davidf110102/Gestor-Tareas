import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddUpdateObjectiveComponent } from './add-update-objective.component';

describe('AddUpdateObjectiveComponent', () => {
  let component: AddUpdateObjectiveComponent;
  let fixture: ComponentFixture<AddUpdateObjectiveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateObjectiveComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddUpdateObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
