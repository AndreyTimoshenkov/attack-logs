import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILog } from './log.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  private readonly _initUrl: string = 'assets/files/attack_logs.json';
  private readonly _updateUrl: string = 'assets/files/update_logs.json';

  getData(): Observable<ILog[]> {
    return this.http.get<ILog[]>(this._initUrl);
  }

  refreshData(): Observable<ILog[]> {
    return this.http.get<ILog[]>(this._updateUrl);
  }
}
