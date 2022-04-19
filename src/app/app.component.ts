import { Component } from '@angular/core';
import { DbService } from './services/db.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Settings', url: '/settings', icon: 'settings' },
  ];
  constructor(private db: DbService) {}
}
