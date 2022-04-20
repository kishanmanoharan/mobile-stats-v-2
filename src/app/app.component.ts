import { Component, OnInit } from '@angular/core';
import { DbService } from './services/db.service';
import { StatusBar, Style } from '@capacitor/status-bar';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Settings', url: '/settings', icon: 'settings' },
  ];
  constructor(private db: DbService) {}
  ngOnInit(): void {}
}
