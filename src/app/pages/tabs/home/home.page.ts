import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateTaskComponent } from 'src/app/shared/components/add-update-task/add-update-task.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user = {} as User
  tasks: Task[]=[]
  loading: boolean = false;

  constructor(
    private firebaseSrc: FirebaseService,
    private utilsSvc: UtilsService

  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getUser()
    this.getTasks()
    
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
        // Obtén la fecha actual en formato 'YYYY-MM-DD'
        //const currentDate = new Date().toLocaleDateString().split(',')[0];
        const currentDate = new Date().toISOString().split('T')[0];
        console.log(currentDate)
        // Filtra las tareas basadas en la fecha actual
        this.tasks = res.filter((task) => {
          // Asegúrate de que 'dueDate' esté en formato 'YYYY-MM-DD'
          const taskDueDate = new Date(task.date).toISOString().split('T')[0];
          console.log(taskDueDate);
          // Compara las fechas sin tener en cuenta la hora exacta
          return taskDueDate === currentDate;
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
