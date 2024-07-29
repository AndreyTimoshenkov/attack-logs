import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { CommonModule } from '@angular/common';
import { Observable, forkJoin, map } from 'rxjs';
import { Sort, MatSortModule} from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ILog, Product, Status} from './log.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule, CommonModule, MatTableModule, MatSortModule, MatButtonModule, MatSelectModule, FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  providers: [DataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  displayedColumns: string[] = ['date', 'type', 'product', 'status'];
  private isRefreshed = false; // a flag to check if refreshLogs has been called
  // Product = Product; // Make the enum accessible in the template
  products = Object.values(Product); // Convert enum to array for iteration
  selectedProduct = Product.AllProducts; // Model for the selected value

  // Status = Status;
  statuses = Object.values(Status);
  selectedStatus = Status.AllStatuses;

  data$: Observable<Array<ILog>> = this.dataService.getData().pipe(
    map(json => JSON.parse(JSON.stringify(json))['logs'])
  )

  readonly updatedData$: Observable<Array<ILog>> = this.dataService.refreshData().pipe(
    map(json => JSON.parse(JSON.stringify(json))['new_logs']),
    )

  constructor( private dataService: DataService ) {}

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') { return; }

    this.data$ = this.data$.pipe(
      map(data => data.sort((a, b) => {
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
      }))
    )
    function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }

  refreshLogs() {
    if (this.isRefreshed) { return; }

    this.data$ = forkJoin([this.data$, this.updatedData$]).pipe(
      map(data => data.flat())
    )
    this.isRefreshed = true;
  }
}
