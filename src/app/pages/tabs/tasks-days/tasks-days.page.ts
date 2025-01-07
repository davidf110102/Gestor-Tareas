import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateTaskComponent } from 'src/app/shared/components/add-update-task/add-update-task.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-tasks-days',
  templateUrl: './tasks-days.page.html',
  styleUrls: ['./tasks-days.page.scss'],
})
export class TasksDaysPage implements OnInit {
  selectedDate: string;
  formatoFechaEntrada: string;




  user = {} as User
  tasks: Task[]=[]
  loading: boolean = false;

  constructor(
    private firebaseSrc: FirebaseService,
    private utilsSvc: UtilsService, private route: ActivatedRoute

  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedDate = params['selectedDate'];
      this.formatoFechaEntrada = this.selectedDate;
      this.selectedDate = this.selectedDate.toString().slice(0, 10);
      this.formatoFechaEntrada = new Date(this.formatoFechaEntrada).toLocaleString().split(',')[0];

    });
  }

  ionViewWillEnter() {
    this.getTasks()
    this.getUser()
  }
  formatDate(date: Date): string {
    return date ? formatDate(date, 'dd/MM/yyyy', 'en-US') : '';
  }

  getUser(){
    return this.user = this.utilsSvc.getElementFromLocaltorage('user')
  }

  getPercentage(task: Task){
    return this.utilsSvc.getPercentage(task)
  }

  async addOrUpdateTask(task?: Task){
    let res= await this.utilsSvc.presentModal({
    component: AddUpdateTaskComponent,
    componentProps: { task },
    cssClass: 'add-update-modal'
    })
    if(res && res.success){
      this.getTasks()
    }
  }

  getTasks(){
    let user: User = this.utilsSvc.getElementFromLocaltorage('user')
    let path = `users/${user.uid}`
    this.loading = true;
    let sub = this.firebaseSrc.getSubcollection(path, 'tasks').subscribe({
      next: (res: Task[]) => {
        console.log(this.selectedDate);

        // Obtén la fecha actual en formato 'YYYY-MM-DD'
        const currentDate = new Date().toLocaleString();
        console.log(currentDate);
        
        // Filtra las tareas basadas en la fecha actual
        this.tasks = res.filter((task) => {
          // Asegúrate de que 'dueDate' esté en formato 'YYYY-MM-DD'
          const taskDueDate = new Date(task.date).toISOString().split('T')[0];
          
          // Compara las fechas sin tener en cuenta la hora exacta
          console.log(taskDueDate);
          return taskDueDate === this.selectedDate;
          
        });
        
        console.log(res);
        sub.unsubscribe()
        this.loading = false;
      }
    })
  }
  confirmDeleteTask(task: Task){
    this.utilsSvc.presentAlert({
      header: 'Eliminar tarea',
      message: '¿Quieres eliminar esta tarea?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteTask(task)
          }
        }
      ]
    })
  }

  deleteTask(task: Task){
    let path = `users/${this.user.uid}/tasks/${task.id}`;
    this.utilsSvc.presentLoading();

    this.firebaseSrc.deleteDocument(path).then(res =>{
    this.utilsSvc.presentToast({
      message: 'Tarea eliminada exitosamente',
      color: 'success',
      icon: 'checkmark-circle-outline',
      duration: 1500
    })

    this.getTasks();
    this.utilsSvc.dismissLoading()
    }, error =>{
      this.utilsSvc.presentToast({
        message: error,
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      })
      this.utilsSvc.dismissLoading()

    })
  }
}
  
  
  
  

