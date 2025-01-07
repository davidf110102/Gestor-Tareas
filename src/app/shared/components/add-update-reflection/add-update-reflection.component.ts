import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Reflection } from 'src/app/models/reflection.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add-update-reflection',
  templateUrl: './add-update-reflection.component.html',
  styleUrls: ['./add-update-reflection.component.scss'],
})
export class AddUpdateReflectionComponent  implements OnInit {

  @Input() date: string;
  @Input() reflection: Reflection;
  user= {} as User;

  form = new FormGroup({
    id: new FormControl(''),
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
    good: new FormControl('', [Validators.required, Validators.minLength(4)]),
    bad: new FormControl('', [Validators.required, Validators.minLength(4)]),
  })

  constructor(
    private firebaseSrc: FirebaseService,
    private utilSvc: UtilsService
  ) { }

  minDate: string;
  ngOnInit() {
    this.user = this.utilSvc.getElementFromLocaltorage('user');

    if(this.reflection){
      this.form.patchValue({
        description: this.reflection.description,
        good: this.reflection.good,
        bad: this.reflection.bad
      });
      this.form.updateValueAndValidity()

    } 
  }


  
  submit(){
    if(this.form.valid){
      if(this.reflection) {
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
    let reflectionData: Reflection
    reflectionData = {
      date: this.date,
      id: '',
      description: this.form.value.description,
      good: this.form.value.good,
      bad: this.form.value.bad
    };
    delete reflectionData.id;
    this.firebaseSrc.addToSubcollection(path, 'reflections', reflectionData).then(res =>{
    this.utilSvc.dismissModal({success: true});
    this.utilSvc.presentToast({
      message: 'Reflexion creada exitosamente',
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
      let path = `users/${this.user.uid}/reflections/${this.reflection.id}`;
      this.utilSvc.presentLoading();
      delete this.form.value.id;
  
      this.firebaseSrc.updateDocument(path, this.form.value).then(res =>{
      this.utilSvc.dismissModal({success: true});
      this.utilSvc.presentToast({
        message: 'Reflexion actualizada exitosamente',
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
