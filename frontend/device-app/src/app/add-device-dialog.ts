import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Device } from './models/device.model';

@Component({
  selector: 'app-add-device-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Device' : 'Add New Device' }}</h2>
    
    <mat-dialog-content>
      <div style="display: flex; flex-direction: column; gap: 15px; padding-top: 10px;">
        <mat-form-field appearance="outline">
          <mat-label>Device Name</mat-label>
          <input matInput [(ngModel)]="newDevice.name" placeholder="e.g. MRI Scanner" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Model Name</mat-label>
          <input matInput [(ngModel)]="newDevice.modelName" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Serial Number</mat-label>
          <input matInput [(ngModel)]="newDevice.serialNumber" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="newDevice.status">
            <mat-option value="ONLINE">ONLINE</mat-option>
            <mat-option value="OFFLINE">OFFLINE</mat-option>
            <mat-option value="MAINTENANCE">MAINTENANCE</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()">
        {{ data ? 'Update Device' : 'Save Device' }}
      </button>
    </mat-dialog-actions>
  `,
})
export class AddDeviceDialogComponent {
  newDevice: Device = { name: '', modelName: '', serialNumber: '', status: 'ONLINE' };

  constructor(
    public dialogRef: MatDialogRef<AddDeviceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Device,
  ) {
    if (data) {
      // Rozbalíme dáta, aby sme neupravovali pôvodný objekt priamo v tabuľke skôr, než klikne na Save
      this.newDevice = { ...data };
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  
  onSave(): void {
    this.dialogRef.close(this.newDevice);
  }
}