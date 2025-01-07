import { Component, OnInit, Input } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateTaskComponent } from 'src/app/shared/components/add-update-task/add-update-task.component';

@Component({
  selector: 'app-task-day',
  templateUrl: './task-day.component.html',
  styleUrls: ['./task-day.component.scss'],
})
export class TaskDayComponent  implements OnInit {
  @Input() objectiveId: string;
  user = {} as User;
  
  tasks: Task[]=[];
  
  loading: boolean = false;

  constructor(
    
    private firebaseSrc: FirebaseService,
    private utilsSvc: UtilsService,
    

  ) { 
    
    
    
  }

  ngOnInit() {
    this.getTasks()
    this.getUser()
    
  }

  ionViewDidEnter() {
    this.getTasks()
    this.getUser()
  }

  ionViewWillEnter() {
    this.getTasks()
    this.getUser()

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
    componentProps: { task,
      objectiveId: this.objectiveId,
     },
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
        if (this.objectiveId) {
          this.tasks = res.filter((task) => task.objectiveId === this.objectiveId);
        } else {
          this.tasks = res;
        }
        sub.unsubscribe()
        this.loading = false;
      }
    })
  }
  getTextColor(percentage: number): string {
    const red = Math.floor((100 - percentage) * 255 / 100);
    const green = Math.floor((percentage) * 255 / 100);

    return `rgb(${red}, ${green}, 0)`;
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

