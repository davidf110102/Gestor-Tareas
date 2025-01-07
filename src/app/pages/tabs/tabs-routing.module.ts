import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'objectives',
        loadChildren: () => import('./objectives/objectives.module').then( m => m.ObjectivesPageModule)
      },
      {
        path: 'calendar',
        loadChildren: () => import('./calendar/calendar.module').then( m => m.CalendarPageModule)
      },
      {
        path: 'reflection',
        loadChildren: () => import('./reflection/reflection.module').then( m => m.ReflectionPageModule)
      },
      {
        path: 'tasks-days',
        loadChildren: () => import('./tasks-days/tasks-days.module').then( m => m.TasksDaysPageModule)
      },
      

    ]
  }
  
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
