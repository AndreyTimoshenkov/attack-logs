import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ILog } from './log.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, HttpClientModule, CommonModule, MatTableModule, MatSortModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  providers: [DataService]
})
export class AppComponent {

  sortedData: Array<ILog> = [];

  readonly data$: Observable<Array<ILog>> = this.dataService.getData().pipe(
    map(json => JSON.parse(JSON.stringify(json)).logs)
  )

  dataSource = new MatTableDataSource(this.sortedData);

  displayedColumns: string[] = ['date', 'type', 'product', 'status'];

  @ViewChild(MatSort) sort: MatSort = new MatSort;

  constructor(private dataService: DataService, private _liveAnnouncer: LiveAnnouncer) {
    this.data$.subscribe(data => this.sortedData = data);
  }

  announceSortChange(column: Sort) {
    console.log(`Sorted ${column.direction}ending`)
  }


  sortData(sort: Sort) {
    const data = this.sortedData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date':
          return compare(a.date, b.date, isAsc);
        case 'type':
          return compare(a.type, b.type, isAsc);
        case 'product':
          return compare(a.product, b.product, isAsc);
        case 'status':
          return compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
    function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }
}
