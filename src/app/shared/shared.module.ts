import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AddUpdateTaskComponent } from './components/add-update-task/add-update-task.component';
import { TaskDayComponent } from './components/task-day/task-day.component';
import { AddUpdateObjectiveComponent } from './components/add-update-objective/add-update-objective.component';
import { AddUpdateReflectionComponent } from './components/add-update-reflection/add-update-reflection.component';


@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    AddUpdateTaskComponent,
    TaskDayComponent,
    AddUpdateObjectiveComponent,
    AddUpdateReflectionComponent
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    NgCircleProgressModule,
    AddUpdateTaskComponent,
    TaskDayComponent,
    AddUpdateObjectiveComponent,
    AddUpdateReflectionComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgCircleProgressModule.forRoot({
      radius: 20,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
      showSubtitle: false,
      space: -5,
      titleFontSize: "15",
      outerStrokeLinecap: "square"
    })
  ]
})
export class SharedModule { }
