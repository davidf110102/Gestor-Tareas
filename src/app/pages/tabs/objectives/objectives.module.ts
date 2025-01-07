import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ObjectivesPageRoutingModule } from './objectives-routing.module';

import { ObjectivesPage } from './objectives.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ObjectivesPageRoutingModule,
    SharedModule
  ],
  declarations: [ObjectivesPage]
})
export class ObjectivesPageModule {}
