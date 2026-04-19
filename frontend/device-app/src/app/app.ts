import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceService } from './services/device.service';
import { Device } from './models/device.model';
import { AddDeviceDialogComponent } from './add-device-dialog';

// Material Moduly
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // Pridané pre tuning
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    FormsModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent implements OnInit {
  devices: Device[] = [];
  displayedColumns: string[] = ['id', 'name', 'modelName', 'serialNumber', 'status', 'actions'];
  isLoading = false; // Presunuté dovnútra triedy

  constructor(private deviceService: DeviceService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadDevices();
  }

  loadDevices() {
    this.isLoading = true;
    this.deviceService.getDevices().subscribe({
      next: (data) => {
        this.devices = data;
        this.isLoading = false;
        console.log('Dáta úspešne načítané:', data);
      },
      error: (err) => {
        console.error('Chyba pri načítaní:', err);
        this.isLoading = false;
      }
    });
  }

  deleteDevice(id: number) {
    if (confirm('Naozaj chcete vymazať toto zariadenie?')) {
      this.deviceService.deleteDevice(id).subscribe(() => {
        this.devices = this.devices.filter((d) => d.id !== id);
      });
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddDeviceDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result: Device | undefined) => {
      if (result) {
        this.deviceService.addDevice(result).subscribe({
          next: () => this.loadDevices(),
          error: (err) => console.error('Chyba pri ukladaní:', err)
        });
      }
    });
  }

  openEditDialog(device: Device) {
    const dialogRef = this.dialog.open(AddDeviceDialogComponent, {
      width: '400px',
      data: device
    });

    dialogRef.afterClosed().subscribe((result: Device | undefined) => {
      if (result && result.id) {
        this.deviceService.updateDevice(result.id, result).subscribe({
          next: () => this.loadDevices(),
          error: (err) => console.error('Chyba pri aktualizácii:', err)
        });
      }
    });
  }
}