import { Component, OnInit } from '@angular/core';
import { Reflection } from 'src/app/models/reflection.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateReflectionComponent } from 'src/app/shared/components/add-update-reflection/add-update-reflection.component';


@Component({
  selector: 'app-reflection',
  templateUrl: './reflection.page.html',
  styleUrls: ['./reflection.page.scss'],
})
export class ReflectionPage implements OnInit {

  user = {} as User
  reflections: Reflection[]=[]
  loading: boolean = false;

  constructor(
    private firebaseSrc: FirebaseService,
    private utilsSvc: UtilsService

  ) { }

  items: string[][] = [];


  ngOnInit() {
    //const startDate = new Date('2024-01-01');
    const today = new Date(); // Fecha actual
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
      const formattedDate = this.formatDate(currentDate);
      
      const formattedDate2 = this.formatDate2(currentDate);
      this.items.push([formattedDate, formattedDate2]);
      

    }
    console.log(this.items)
    this.getReflections()
  }

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('es-ES', options);
    const firstLetterUpperCase = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    return firstLetterUpperCase;
  }

  private formatDate2(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Asegura que el mes tenga dos dígitos
    const day = date.getDate().toString().padStart(2, '0'); // Asegura que el día tenga dos dígitos
  return `${year}-${month}-${day}`;
  }
  AddOrUpdateObjetive2(item: string){
    console.log(item);

  }
  ionViewWillEnter() {
    this.getUser()
    this.getReflections()
    
  }
  getUser(){
    return this.user = this.utilsSvc.getElementFromLocaltorage('user')
  }
  async addOrUpdateReflections(date: string){
    const reflection = this.reflections.find(reflection => reflection.date === date);
    let res= await this.utilsSvc.presentModal({
    component: AddUpdateReflectionComponent,
    componentProps: { reflection, date },
    cssClass: 'add-update-modal'
    })
    if(res && res.success){
      this.getReflections()
    }
  }
  getReflections(){
    let user: User = this.utilsSvc.getElementFromLocaltorage('user')
    let path = `users/${user.uid}`
    this.loading = true;
    let sub = this.firebaseSrc.getSubcollection(path, 'reflections').subscribe({
      next: (res: Reflection[]) => {
        this.reflections = res;
        console.log(res);
        sub.unsubscribe()
        this.loading = false;
      }
    })
  }
  getReflectionDescription(date: string): string {
    const matchingReflection = this.reflections.find(reflection => reflection.date === date);
    return matchingReflection ? matchingReflection.description : '';
  }
  getReflectionGood(date: string): string {
    const matchingReflection = this.reflections.find(reflection => reflection.date === date);
    return matchingReflection ? matchingReflection.good : '';
  }
  getReflectionBad(date: string): string {
    const matchingReflection = this.reflections.find(reflection => reflection.date === date);
    return matchingReflection ? matchingReflection.bad : '';
  }

  confirmDeleteTask(reflection: Reflection){
    this.utilsSvc.presentAlert({
      header: 'Eliminar Reflexion',
      message: '¿Quieres eliminar esta Reflexion?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteReflection(reflection)
          }
        }
      ]
    })
  }

  deleteReflection(reflection: Reflection){
    let path = `users/${this.user.uid}/reflections/${reflection.id}`;
    this.utilsSvc.presentLoading();

    this.firebaseSrc.deleteDocument(path).then(res =>{
    this.utilsSvc.presentToast({
      message: 'Reflexion eliminada exitosamente',
      color: 'success',
      icon: 'checkmark-circle-outline',
      duration: 1500
    })

    this.getReflections();
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
