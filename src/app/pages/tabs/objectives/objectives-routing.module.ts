import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObjectivesPage } from './objectives.page';

const routes: Routes = [
  {
    path: '',
    component: ObjectivesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObjectivesPageRoutingModule {}
