import { Component, OnDestroy, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';
import { ToastController } from '@ionic/angular';
import { ConnectionService } from '../services/connection.service';
import * as Rj from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  ws: WebSocket;
  data: any;

  cpu: any;
  gpu: any;
  ram: any;

  constructor(
    private db: DbService,
    private connection: ConnectionService,
    private toast: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAddress();
  }

  ngOnDestroy(): void {
    if (this.ws) {
      this.ws.close();
      console.log('CLOSED');
    }
  }

  checkAddress = async () => {
    const data = await this.db.getAddress();
    console.log(data);

    if (data.ip && data.port) {
      this.connect(data);
    } else {
      // this.errorToast();
    }
  };

  errorToast = () => {
    this.toast
      .create({
        message: 'Error communicating with server, please revise address',
        buttons: [
          {
            text: 'Settings',
            role: 'cancel',
            handler: () => {
              this.router.navigate(['settings']);
            },
          },
        ],
      })
      .then((toast) => toast.present());
  };

  connect = (data) => {
    console.log('CONNECT');
    try {
      this.ws = new WebSocket(`ws://${data.ip}:${data.port}`);
      this.ws.onmessage = (message) => {
        message = JSON.parse(message.data);
        console.log(message);
        this.data = message;
        this.cpu = {
          name: message[0].name,
          load: Math.ceil(
            message[0].sensors.find((item) => item.name === 'CPU Total').value
          ),
          power: Math.ceil(
            message[0].sensors.find((item) => item.name === 'Package').value
          ),
          temp: Math.ceil(
            message[0].sensors.find((item) => item.name === 'Core (Tctl/Tdie)')
              .value
          ),
        };
        this.ram = {
          name: message[1].name,
          used: Math.ceil(
            message[1].sensors.find((item) => item.name === 'Memory Used').value
          ),
          free: Math.ceil(
            message[1].sensors.find((item) => item.name === 'Memory Available')
              .value
          ),
          load: Math.ceil(
            message[1].sensors.find((item) => item.name === 'Memory').value
          ),
        };
        this.gpu = {
          name: message[2].name,
          temp: Math.ceil(
            message[2].sensors.find(
              (item) => item.name === 'GPU Core' && item.type === 'Temperature'
            ).value
          ),
          clock: Math.ceil(
            message[2].sensors.find(
              (item) => item.name === 'GPU Core' && item.type === 'Clock'
            ).value
          ),
          load: Math.ceil(
            message[2].sensors.find(
              (item) => item.name === 'GPU Core' && item.type === 'Load'
            ).value
          ),
          memUsed: Math.ceil(
            message[2].sensors.find((item) => item.name === 'GPU Memory Used')
              .value
          ),
          memFree: Math.ceil(
            message[2].sensors.find((item) => item.name === 'GPU Memory Free')
              .value
          ),
        };

        this.setVisibility();
      };
    } catch (e) {
      console.error(e);
      this.errorToast();
    }
  };

  setVisibility = () => {
    const div = document.getElementById('stats').clientHeight;
    document.getElementById('cpu').style.height = div / 3.3 + 'px';
    document.getElementById('gpu').style.height = div / 3.3 + 'px';
    document.getElementById('ram').style.height = div / 3.3 + 'px';

    document.getElementById('loading').style.opacity = '0';
    document.getElementById('stats').style.opacity = '1';
    this.setBackground();
  };

  setBackground = () => {
    document.getElementById('cpu').style.backgroundPositionY =
      this.cpu.load + '%';
    document.getElementById('cpu').style.backgroundColor = this.getColor(
      this.cpu.load
    );
    document.getElementById('gpu').style.backgroundPositionY =
      this.gpu.load + '%';
    document.getElementById('gpu').style.backgroundColor = this.getColor(
      this.gpu.load
    );
    document.getElementById('ram').style.backgroundPositionY =
      this.ram.load + '%';
    document.getElementById('ram').style.backgroundColor = this.getColor(
      this.ram.load
    );
  };

  getColor = (load: number) => {
    if (load >= 80) {
      return 'rgba(237, 87, 107, 0.8)';
    } else if (load >= 60) {
      return 'rgba(255, 202, 34, 0.8)';
    } else {
      return 'rgba(66, 215, 125, 0.8)';
    }
  };
}
// linear-gradient(0deg, rgba(0,255,46,1) 0%, rgba(210,45,8,1) 43%);

// setBackground = () => {
//   // const cpuText = `linear-gradient(0deg, ${this.getColor(
//   //   this.cpu.load
//   // )} 0%, rgba(36, 36, 36, 1) ${this.cpu.load}%)`;
//   document.getElementById('cpu').style.backgroundColor = this.getColor(
//     this.cpu.load
//   );
//   // const gpuText = `linear-gradient(0deg, ${this.getColor(
//   //   this.gpu.load
//   // )} 0%, rgba(36, 36, 36, 1) ${this.gpu.load}%)`;
//   document.getElementById('gpu').style.backgroundColor = this.getColor(
//     this.gpu.load
//   );
//   // const ramText = `linear-gradient(0deg, ${this.getColor(
//   //   this.ram.load
//   // )} 0%, rgba(36, 36, 36, 1) ${this.ram.load}%)`;
//   document.getElementById('ram').style.backgroundColor = this.getColor(
//     this.ram.load
//   );
// };
