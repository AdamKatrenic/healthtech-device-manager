import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceService } from './services/device.service';
import { Device } from './models/device.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html', // Tu musí byť presne názov tvojho html súboru
  styleUrl: './app.scss'     // A tvojho scss súboru
})
export class AppComponent implements OnInit {
  devices: Device[] = [];

  constructor(private deviceService: DeviceService) {}

  ngOnInit() {
    this.deviceService.getDevices().subscribe({
      next: (data) => {
        this.devices = data;
        console.log('Dáta z backendu:', data);
      },
      error: (err) => console.error('Chyba pripojenia na Java backend:', err)
    });
  }
}