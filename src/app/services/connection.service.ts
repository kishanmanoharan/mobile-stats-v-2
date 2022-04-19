import { Injectable } from '@angular/core';
import { DbService } from './db.service';
// import { WebSocket } from 'ws';
import { ToastController } from '@ionic/angular';

import * as Rj from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  ws: WebSocket;

  constructor(
    private db: DbService,
    private toast: ToastController // private websocket: WebSocket
  ) {}

  async testServer(ip: string, port: number) {
    let count = 0;
    console.log('WS test');

    const testWs = new WebSocket(`ws://${ip}:${port}`);
    this.toast
      .create({
        message: 'Testing. Please wait...',
        duration: 3000,
      })
      .then((toast) => toast.present());

    testWs.onopen = () => {
      console.log('SERVER OPEN');
      testWs.onmessage = (data) => {
        console.log(data);
        count += 1;
        if (count > 2) {
          this.toast
            .create({
              message: 'Server established, saved address',
              duration: 3000,
            })
            .then((toast) => toast.present());
          this.db.saveAddress(ip, port);
          testWs.close();
        }
      };
    };
  }

  async connectServer(ip: string, port: number) {
    console.log('CONNECT');
  }
}
