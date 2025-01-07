import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReflectionPageRoutingModule } from './reflection-routing.module';

import { ReflectionPage } from './reflection.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReflectionPageRoutingModule,
    SharedModule
  ],
  declarations: [ReflectionPage]
})
export class ReflectionPageModule {}
