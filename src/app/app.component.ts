import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, combineLatest, map, shareReplay } from 'rxjs';
import { Sort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ILog, Product, Status } from './log.interface';
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
  styleUrls: ['./app.component.less'],
  providers: [DataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly displayedColumns = ['date', 'type', 'product', 'status'];
  private isRefreshed = false;
  readonly products = Object.values(Product);
  selectedProduct: Product = Product.AllProducts;
  readonly statuses = Object.values(Status);
  selectedStatus: Status = Status.AllStatuses;
  readonly isSmallScreen$ = this.breakpointObserver.observe(Breakpoints.XSmall).pipe(
    map(media => media.matches)
  );

  private readonly data$: Observable<ILog[]> = this.dataService.getData().pipe(
      map(json => JSON.parse(JSON.stringify(json))['logs']),
      shareReplay(1)
    );

  refreshedData$: Observable<ILog[]> = this.dataService.refreshData().pipe(
    map(json => JSON.parse(JSON.stringify(json))['new_logs']),
  )

  private readonly productFilter$ = new BehaviorSubject<Product>(Product.AllProducts);
  private readonly statusFilter$ = new BehaviorSubject<Status>(Status.AllStatuses);

  filteredData$: Observable<Array<ILog>> = combineLatest([
    this.data$,
    this.productFilter$,
    this.statusFilter$
  ]).pipe(
    map(([logs, product, status]) => {
      return logs.filter(log =>
        (product === Product.AllProducts || log.product === product) &&
        (status === Status.AllStatuses || log.status === status)
      );
    })
  );

  constructor(private dataService: DataService, private breakpointObserver: BreakpointObserver) {}

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') { return; }

    this.data$.pipe(
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
      })))

    function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }

  refreshLogs() {
    if (this.isRefreshed) { return; }
    this.isRefreshed = true;

    this.filteredData$ = combineLatest([
      this.data$,
      this.refreshedData$,
      this.productFilter$,
      this.statusFilter$
    ]).pipe(
      map(([logs, new_logs, product, status]) => {
        const updated = logs.concat(new_logs);
        return updated.filter(log =>
          (product === Product.AllProducts || log.product === product) &&
          (status === Status.AllStatuses || log.status === status)
        );
      })
    );

    this.onProductChange();
    this.onStatusChange();
  }

  onProductChange() {
    this.productFilter$.next(this.selectedProduct);
  }

  onStatusChange() {
    this.statusFilter$.next(this.selectedStatus);
  }
}
