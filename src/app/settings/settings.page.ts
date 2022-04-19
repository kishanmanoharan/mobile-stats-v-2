import { Component, OnInit } from '@angular/core';

import { DbService } from '../services/db.service';
import { ConnectionService } from '../services/connection.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  ip = '';
  port: any;

  // private store: Storage | null = null;

  constructor(private db: DbService, private connection: ConnectionService) {}

  async ngOnInit() {
    await this.db.getAddress().then((res) => {
      // console.log(res.ip);
      this.ip = res.ip;
      this.port = res.port;
    });
  }

  saveData = async () => {
    // await this.store.set('address', { ip: this.ip, port: this.port });
    await this.db.saveAddress(this.ip, this.port);
  };

  clearData = async () => {
    console.log('clear');
    await this.db.saveAddress(null, null);
    this.ip = '';
    this.port = null;
  };

  test = () => {
    console.log(this.ip, this.port);
    this.connection.testServer(this.ip, this.port);
  };
}
