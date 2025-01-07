import { Component, Input, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  @Input() title: string;
  @Input() backButton : string;
  @Input() isModal: boolean;
  @Input() color: string;
  @Input() centerTitle: boolean;

  darkMode;

  constructor(
    private utilSvc: UtilsService
  ) { }

  ngOnInit() {}

  dismissNodal(){
    this.utilSvc.dismissModal()
  }
  setTheme(darkMode: boolean){
    this.darkMode=darkMode;
  }
}
