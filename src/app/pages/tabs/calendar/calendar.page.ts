import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage{
  //calendarOptions: CalendarComponentOptions = {
    //from: new Date(2022, 0, 1), // Fecha de inicio
    //to: new Date(2022, 11, 31), // Fecha de fin
  

  constructor(private navCtrl: NavController, private router: Router) { }


  onDateChange(event: any) {
    const selectedDate = event.detail.value;
    // Aquí puedes redirigir a la página task-days con el valor de la fecha seleccionada
    this.router.navigate(['/tabs/tasks-days'], { queryParams: { selectedDate } });
  }
  


}
