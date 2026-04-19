import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceService } from './services/device.service';
import { Device } from './models/device.model';
import { AddDeviceDialogComponent } from './add-device-dialog';

// Material Moduly
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import notifikácií
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
    MatSnackBarModule, // Musí byť tu
    FormsModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent implements OnInit {
  devices: Device[] = [];
  dataSource = new MatTableDataSource<Device>([]); // Zdroj pre tabuľku a filter
  displayedColumns: string[] = ['id', 'name', 'modelName', 'serialNumber', 'status', 'actions'];
  isLoading = false;

  constructor(
    private deviceService: DeviceService, 
    private dialog: MatDialog,
    private snackBar: MatSnackBar // Injektáž služby
  ) {}

  ngOnInit() {
    this.loadDevices();
  }

  // Gettery pre karty štatistík
  get totalDevices(): number { return this.devices.length; }
  get onlineDevices(): number { return this.devices.filter(d => d.status === 'ONLINE').length; }
  get maintenanceDevices(): number { return this.devices.filter(d => d.status === 'MAINTENANCE').length; }

  loadDevices() {
    this.isLoading = true;
    this.deviceService.getDevices().subscribe({
      next: (data) => {
        this.devices = data;
        this.dataSource.data = data; // Dôležité pre vyhľadávanie
        this.isLoading = false;
      },
      error: (err) => {
        this.showNotification('Failed to load devices', 'error');
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteDevice(id: number) {
    if (confirm('Are you sure you want to delete this asset?')) {
      this.deviceService.deleteDevice(id).subscribe({
        next: () => {
          this.loadDevices();
          this.showNotification('Asset deleted successfully');
        },
        error: () => this.showNotification('Error deleting asset', 'error')
      });
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddDeviceDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((result: Device | undefined) => {
      if (result) {
        this.deviceService.addDevice(result).subscribe({
          next: () => {
            this.loadDevices();
            this.showNotification('Asset registered successfully');
          },
          error: () => this.showNotification('Error saving asset', 'error')
        });
      }
    });
  }

  openEditDialog(device: Device) {
    const dialogRef = this.dialog.open(AddDeviceDialogComponent, { width: '400px', data: device });
    dialogRef.afterClosed().subscribe((result: Device | undefined) => {
      if (result && result.id) {
        this.deviceService.updateDevice(result.id, result).subscribe({
          next: () => {
            this.loadDevices();
            this.showNotification('Asset updated successfully');
          },
          error: () => this.showNotification('Error updating asset', 'error')
        });
      }
    });
  }

  // TÁTO FUNKCIA TI CHÝBALA (alebo bola zle umiestnená)
  showNotification(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: type === 'success' ? ['style-success'] : ['style-error']
    });
  }
} // Koniec triedy