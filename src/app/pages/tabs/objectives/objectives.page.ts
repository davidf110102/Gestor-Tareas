import { Component, OnInit } from '@angular/core';
import { Objective, Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateObjectiveComponent } from 'src/app/shared/components/add-update-objective/add-update-objective.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.page.html',
  styleUrls: ['./objectives.page.scss'],
})
export class ObjectivesPage implements OnInit {

  user = {} as User
  objectives: Objective[]=[]
  tasks: Task[]=[]
  tasksTotal: Task[]=[]
  tasksFiltrado: Task[]=[]
  
  loading: boolean = false;

  constructor(
    private firebaseSrc: FirebaseService,
    private utilsSvc: UtilsService

  ) { }

  ngOnInit() {
    
    
  }

  ionViewWillEnter() {
    this.getObjectives();
    this.getUser();
    this.filtro();
    this.getTasksTotal()
    
  }

  getUser(){
    return this.user = this.utilsSvc.getElementFromLocaltorage('user')
  }
  imprimir(){
    console.log(this.tasksTotal);
  }

  getPercentage2(objective: Objective){
    /*this.getTasksTotal();
    console.log(this.tasksTotal);
    if (this.tasksFiltrado.length > 0) {
      this.tasksFiltrado = this.tasksFiltrado.filter(task => task.objectiveId === objective.id);
      
    } else {*/
    return this.utilsSvc.getPercentage2(this.tasksTotal, objective); 
    
  }
  filtro(){
    this.tasksTotal = this.tasksTotal.filter(task => task.objectiveId !== undefined);
    this.tasksFiltrado = this.tasksTotal;
  }


  async addOrUpdateObjective(objective?: Objective){
    let res= await this.utilsSvc.presentModal({
    component: AddUpdateObjectiveComponent,
    componentProps: { objective },
    cssClass: 'add-update-modal'
    })
    if(res && res.success){
      this.getObjectives()
    }
  }
  getObjectives(){
    let user: User = this.utilsSvc.getElementFromLocaltorage('user')
    let path = `users/${user.uid}`
    this.loading = true;
    let sub = this.firebaseSrc.getSubcollection(path, 'objectives').subscribe({
      next: (res: Objective[]) => {

        this.objectives=res;
        sub.unsubscribe()
        this.loading = false;
      }
    })
  }
  confirmDeleteObjective(objective: Objective){
    this.utilsSvc.presentAlert({
      header: 'Eliminar objetivo',
      message: '¿Quieres eliminar este objetivo?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteObjective(objective)
          }
        }
      ]
    })
  }
  getTasksTotal() {
    let user: User = this.utilsSvc.getElementFromLocaltorage('user');
    let path = `users/${user.uid}`;
    this.loading = true;
  
    let sub = this.firebaseSrc.getSubcollection(path, 'tasks').subscribe({
      next: (res: Task[]) => {
        this.tasksTotal = res; 
        sub.unsubscribe();
        this.loading = false;
        this.filtro(); 
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
        this.loading = false;
      }
    });
  }

    

  

  deleteObjective(objective: Objective){
    let path = `users/${this.user.uid}/objectives/${objective.id}`;
    this.utilsSvc.presentLoading();

    this.firebaseSrc.deleteDocument(path).then(res =>{
    this.utilsSvc.presentToast({
      message: 'Objetivo eliminado exitosamente',
      color: 'success',
      icon: 'checkmark-circle-outline',
      duration: 1500
    })

    this.getObjectives();
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
