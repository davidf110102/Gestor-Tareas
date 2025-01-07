import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Item, Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-add-update-task',
  templateUrl: './add-update-task.component.html',
  styleUrls: ['./add-update-task.component.scss'],
})
export class AddUpdateTaskComponent  implements OnInit {
  @Input() objectiveId: string;
  @Input() task: Task;
  user= {} as User;
  showCalendar: boolean = false;

  form = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
    date: new FormControl(new Date()),
    items: new FormControl([], [Validators.required, Validators.minLength(1)]),

  })

  constructor(
    private firebaseSrc: FirebaseService,
    private utilSvc: UtilsService
  ) { 
    
  }

  minDate: string;
  ngOnInit() {
    this.user = this.utilSvc.getElementFromLocaltorage('user');
    this.minDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

    if(this.task){
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description,
        date: this.task.date,
        items: this.task.items
      });
      this.form.updateValueAndValidity();

    } else {
      this.form.patchValue({
        date: new Date(),
      });
    }
    
  }
  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  formatDate(date: Date): string {
    return date ? formatDate(date, 'dd/MM/yyyy', 'en-US') : '';
  }
  //Crear o actualizar tarea
  submit(){
    if(this.form.valid){
      if(this.task) {
        this.updateTask()
      }else{
        this.createTask();
      }
    }
  }
  //==== Crear Tarea =====
  createTask(){
    let path = `users/${this.user.uid}`;
    this.utilSvc.presentLoading();
    delete this.form.value.id;
    let taskData: Task; 
    if (this.objectiveId) {
      taskData = {
        objectiveId: this.objectiveId,
      id: '', // Asigna un valor vacío o como lo requieras
      title: this.form.value.title,
      description: this.form.value.description,
      date: this.form.value.date,
      items: this.form.value.items
       };
    } else {
      taskData = {
        id: '', // Asigna un valor vacío o como lo requieras
      title: this.form.value.title,
      description: this.form.value.description,
      date: this.form.value.date,
      items: this.form.value.items
      };
    }
    delete taskData.id;

    this.firebaseSrc.addToSubcollection(path, 'tasks', taskData).then(res =>{
    this.utilSvc.dismissModal({success: true});
    this.utilSvc.presentToast({
      message: 'Tarea creada exitosamente',
      color: 'success',
      icon: 'checkmark-circle-outline',
      duration: 1500
    })
    this.utilSvc.dismissLoading()
    }, error =>{
      this.utilSvc.presentToast({
        message: error,
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      })
      this.utilSvc.dismissLoading()

    })
  }

    //==== Editar Tarea =====
    updateTask(){
      let path = `users/${this.user.uid}/tasks/${this.task.id}`;
      this.utilSvc.presentLoading();
      delete this.form.value.id;
  
      this.firebaseSrc.updateDocument(path, this.form.value).then(res =>{
      this.utilSvc.dismissModal({success: true});
      this.utilSvc.presentToast({
        message: 'Tarea actualizada exitosamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      })
      this.utilSvc.dismissLoading()
      }, error =>{
        this.utilSvc.presentToast({
          message: error,
          color: 'warning',
          icon: 'alert-circle-outline',
          duration: 5000
        })
        this.utilSvc.dismissLoading()
  
      })
    }


  getPercentage(){
    return this.utilSvc.getPercentage(this.form.value as Task)
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.form.value.items = ev.detail.complete(this.form.value.items);
    this.form.updateValueAndValidity();
  }

  removeItem(index: number){
    this.form.value.items.splice(index, 1);
    this.form.controls.items.updateValueAndValidity();
  }

  createItem(){
    this.utilSvc.presentAlert({
      header: 'Nueva Actividad',
      backdropDismiss: false,
      inputs: [
        {
          name: 'name',
          type: 'textarea',
          placeholder: 'Hacer algo...'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Agregar',
          handler: (res) => {
            let item: Item = {name: res.name, completed: false};
            this.form.value.items.push(item);
            this.form.controls.items.updateValueAndValidity();
          }
        }
      ]

    })
  }


}
