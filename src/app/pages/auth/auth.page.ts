import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]), 
  })

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSVC: UtilsService
  ) { }

  ngOnInit() {
  }

  
  submit() {
    if (this.form.valid) {

      this.utilsSVC.presentLoading({ message: "Autenticando..." })
      this.firebaseSvc.login(this.form.value as User).then(async res => {
        console.log(res);
        let user: User = {
          uid: res.user.uid,
          name: res.user.displayName,
          email: res.user.email
        }
        this.utilsSVC.setElementInLocalstorage('user', user);
        this.utilsSVC.routerLink('/tabs/home')

        this.utilsSVC.dismissLoading();
        this.utilsSVC.presentToast({
          message: `Te damos la bienvenida ${user.name}`,
          duration: 1500,
          color: 'primary',
          icon: 'person-outline'
        })
        this.form.reset();
      }, error => {
        this.utilsSVC.dismissLoading();
        this.utilsSVC.presentToast({
          message: error,
          duration: 5000,
          color: 'warning',
          icon: 'alert-circle-outline'
        })


      })
    }
  }

}
