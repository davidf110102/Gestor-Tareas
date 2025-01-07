import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user = {} as User;
  trophies: Trophy[] = [];
  tasks: Task[] = [];
  loading: boolean = false;

  constructor(
    private firebaseSrc: FirebaseService,
    private utilSvc: UtilsService
  ) { }
  getDaysWithAllTasksCompleted(tasks: Task[]): number {
    const completedDays: Set<string> = new Set();

    tasks.forEach((task) => {
      const isTaskCompleted = task.items.every((item) => item.completed);
      if (isTaskCompleted) {
        const taskDate = task.date.toISOString().split('T')[0];
        completedDays.add(taskDate);
      }
    });
    console.log(12)
    console.log(completedDays);
    return completedDays.size;
    
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getUser()
    this.getTasks();
    this.checkTrophies();
  }



  getUser(){
    return this.user = this.utilSvc.getElementFromLocaltorage('user')
  }

  signOut() {
    this.utilSvc.presentAlert({
      header: 'Cerrar Sesión',
      message: '¿Quieres cerrar sesión?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Si, cerrar',
          handler: () => {
            this.firebaseSrc.signOut();
          }
        }
      ]
    })
  }
  getTasks() {
    let user: User = this.utilSvc.getElementFromLocaltorage('user');
    let path = `users/${user.uid}`;
    this.loading = true;
    let sub = this.firebaseSrc.getSubcollection(path, 'tasks').subscribe({
      next: (res: Task[]) => {
        this.tasks = res;
        sub.unsubscribe();
        this.loading = false;
      },
    });
  }
  getPercentage(task: Task){
    return this.utilSvc.getPercentage(task)
  }
  checkTrophies() {
    this.trophies = [];

    // Ejemplo de trofeo 1: Completar al 100% la primera tarea
    const firstTask = this.tasks.find((task) => this.getPercentage(task) === 100);
    
    console.log(firstTask);
    console.log(this.tasks.length);
    if (firstTask) {
      this.trophies.push({ name: 'Primera Tarea Completada', condition: true });
    }

    const completedTasks = this.tasks.filter((task) => this.getPercentage(task) === 100);

  // Ejemplo de trofeo 2: Completar 5 tareas
  if (completedTasks.length >= 5) {
    this.trophies.push({ name: '5 Tareas Completadas', condition: true });
  }

  // Ejemplo de trofeo 3: Completar 10 tareas
  if (completedTasks.length >= 10) {
    this.trophies.push({ name: '10 Tareas Completadas', condition: true });
  }

  // Ejemplo de trofeo 4: Completar 20 tareas
  if (completedTasks.length >= 20) {
    this.trophies.push({ name: '20 Tareas Completadas', condition: true });
  }

  // Ejemplo de trofeo 5: Completar 50 tareas
  if (completedTasks.length >= 50) {
    this.trophies.push({ name: '50 Tareas Completadas', condition: true });
  }
  
    
  }
}

interface Trophy {
  name: string;
  condition: boolean;
}



