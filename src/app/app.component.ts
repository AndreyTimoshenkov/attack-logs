import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, HttpClientModule, CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  providers: [DataService]
})
export class AppComponent {

  private readonly _initUrl: string = 'assets/files/attack_logs.json';
  private readonly _updateUrl: string = 'assets/files/update_logs.json';

  readonly data$ = this.dataService.getData(this._initUrl).pipe(
    map(json => JSON.parse(JSON.stringify(json)).logs)
  )
  // .subscribe(data => console.log(data.logs));

  constructor(private dataService: DataService) {}
}
