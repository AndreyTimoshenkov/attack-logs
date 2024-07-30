import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, combineLatest, forkJoin, map, tap } from 'rxjs';
import { Sort, MatSortModule} from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ILog, Product, Status} from './log.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule, CommonModule, MatTableModule, MatSortModule, MatButtonModule,
    MatSelectModule, FormsModule, LayoutModule, MatProgressSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  providers: [DataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly displayedColumns = ['date', 'type', 'product', 'status'];
  private isRefreshed = false;
  readonly products = Object.values(Product);
  readonly selectedProduct = Product.AllProducts;
  readonly statuses = Object.values(Status);
  readonly selectedStatus = Status.AllStatuses;
  readonly isSmallScreen$ = this.breakpointObserver.observe(Breakpoints.XSmall).pipe(
    map(media => media.matches)
  );

  data$: Observable<Array<ILog>> = this.dataService.getData().pipe(
    map(json => JSON.parse(JSON.stringify(json))['logs']),
  );

  readonly updatedData$: Observable<Array<ILog>> = this.dataService.refreshData().pipe(
    map(json => JSON.parse(JSON.stringify(json))['new_logs']),
  );

  productFilter$ = new BehaviorSubject<Product>(Product.AllProducts);
  statusFilter$ = new BehaviorSubject<Status>(Status.AllStatuses);

  constructor( private dataService: DataService, private breakpointObserver: BreakpointObserver ) {}

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') { return; }

    this.data$ = this.data$.pipe(
      map(data => data?.sort((a, b) => {
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
      })),
    )
    function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }

  refreshLogs() {
    if (this.isRefreshed) { return; }

    this.data$ = forkJoin([this.data$, this.updatedData$])
    .pipe(
      map(data => data.flat())
    )

    this.isRefreshed = true;
  }

  onProductChange() {
    this.productFilter$.next(this.selectedProduct);

    this.data$ = combineLatest([this.data$, this.productFilter$])
      .pipe(
        map(([logs, product]) => {
          return product === Product.AllProducts
            ? logs
            : logs.filter(log => log.product === product)
        }
      )
    )
  }

  onStatusChange() {
    this.statusFilter$.next(this.selectedStatus);

    this.data$ = combineLatest([this.data$, this.statusFilter$])
      .pipe(
        map(([logs, status]) => {
          return status === Status.AllStatuses
            ? logs
            : logs.filter(log => log.status === status)
        }
      )
    )
  }
}
