import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { DeviceService } from './services/device.service';
import { Device } from './models/device.model';
import { AddDeviceDialogComponent } from './add-device-dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; 
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

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
    MatSnackBarModule,
    MatPaginatorModule,
    MatTooltipModule,
    FormsModule,
    MatButtonToggleModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent implements OnInit, AfterViewInit { 
  devices: Device[] = [];
  dataSource = new MatTableDataSource<Device>([]); 
  displayedColumns: string[] = ['id', 'name', 'modelName', 'serialNumber', 'status', 'actions'];
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private deviceService: DeviceService, 
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadDevices();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  get totalDevices(): number { return this.devices.length; }
  get onlineDevices(): number { return this.devices.filter(d => d.status === 'ONLINE').length; }
  get maintenanceDevices(): number { return this.devices.filter(d => d.status === 'MAINTENANCE').length; }

  loadDevices() {
    this.isLoading = true;
    this.deviceService.getDevices().subscribe({
      next: (data) => {
        this.devices = data;
        this.dataSource.data = data;
        
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        
        this.isLoading = false;
      },
      error: () => {
        this.showNotification('Error loading assets', 'error');
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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

  showNotification(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: type === 'success' ? ['style-success'] : ['style-error']
    });
  }

  exportToPDF() {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    doc.setFontSize(18);
    doc.text('Medical Device Inventory Report', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${timestamp}`, 14, 30);

    const exportData = this.dataSource.filteredData.map(device => [
      device.id?.toString() ?? '',
      device.name ?? '',
      device.modelName ?? '',
      device.serialNumber ?? '',
      device.status ?? ''
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['ID', 'Device Name', 'Model', 'Serial Number', 'Status']],
      body: exportData,
      theme: 'striped',
      headStyles: { fillColor: [26, 35, 126] },
      styles: { fontSize: 10 },
      didDrawPage: (data) => {
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        const pageCount = (doc as any).internal.getNumberOfPages(); 
        
        doc.setFontSize(10);
        doc.text(
          `Page ${pageCount}`, 
          data.settings.margin.left, 
          pageHeight - 10
        );
      }
    });

    doc.save(`MedTrack_Inventory_${new Date().getTime()}.pdf`);
    this.showNotification('PDF Report generated successfully');
  }

  applyStatusFilter(status: string) {
  if (status === 'ALL') {
    this.dataSource.filter = ''; // Reset filtra
  } else {
    this.dataSource.filter = status.trim().toLowerCase();
  }

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
}