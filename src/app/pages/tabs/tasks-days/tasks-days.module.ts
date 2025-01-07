import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TasksDaysPageRoutingModule } from './tasks-days-routing.module';

import { TasksDaysPage } from './tasks-days.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TasksDaysPageRoutingModule,
    SharedModule
  ],
  declarations: [TasksDaysPage]
})
export class TasksDaysPageModule {}
