import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private store: Storage | null = null;

  constructor(
    private storage: Storage,
    private platform: Platform,
    private toast: ToastController
  ) {
    this.platform.ready().then(() => {
      this.init();
    });
  }

  async init() {
    console.log('DB INIT');
    this.store = new Storage();
    await this.store.create();

    this.toast
      .create({
        message: 'Database Initiated',
        duration: 3000,
      })
      .then((toast) => toast.present());
  }

  async getAddress() {
    return await this.store.get('address');
  }

  async saveAddress(ip: string, port: number) {
    console.log('SAVE', ip, port);

    const data = { ip, port };
    return await this.store.set('address', data);
  }
}
