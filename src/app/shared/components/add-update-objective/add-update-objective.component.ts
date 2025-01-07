import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Item, Objective, Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add-update-objective',
  templateUrl: './add-update-objective.component.html',
  styleUrls: ['./add-update-objective.component.scss'],
})
export class AddUpdateObjectiveComponent  implements OnInit {

  @Input() objective: Objective;
  user= {} as User;
  showCalendar: boolean = false;

  form = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
  })

  constructor(
    private firebaseSrc: FirebaseService,
    private utilSvc: UtilsService
  ) { }

  minDate: string;
  ngOnInit() {
    this.user = this.utilSvc.getElementFromLocaltorage('user');
    this.minDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

    if(this.objective){
      this.form.setValue(this.objective);
      this.form.updateValueAndValidity()

    } 
  }


  formatDate(date: Date): string {
    return date ? formatDate(date, 'dd/MM/yyyy', 'en-US') : '';
  }
  //Crear o actualizar tarea
  submit(){
    if(this.form.valid){
      if(this.objective) {
        this.updateObjective()
      }else{
        this.createObjective();
      }
    }
  }
  //==== Crear Tarea =====
  createObjective(){
    let path = `users/${this.user.uid}`;
    this.utilSvc.presentLoading();
    delete this.form.value.id;

    this.firebaseSrc.addToSubcollection(path, 'objectives', this.form.value).then(res =>{
    this.utilSvc.dismissModal({success: true});
    this.utilSvc.presentToast({
      message: 'Objetivo creado exitosamente',
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
    updateObjective(){
      let path = `users/${this.user.uid}/objectives/${this.objective.id}`;
      this.utilSvc.presentLoading();
      delete this.form.value.id;
  
      this.firebaseSrc.updateDocument(path, this.form.value).then(res =>{
      this.utilSvc.dismissModal({success: true});
      this.utilSvc.presentToast({
        message: 'Objetivo actualizado exitosamente',
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


  

 



  

}
