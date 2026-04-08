import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'http://localhost:8080/api/devices';

  constructor(private http: HttpClient) { }

  getDevices(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}