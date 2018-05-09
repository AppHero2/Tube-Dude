import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { SelectionModel } from '@angular/cdk/collections';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { UserService, LoanStatus } from './user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations : fuseAnimations
})

export class UsersComponent implements OnInit {

  selection = new SelectionModel<string>(true, []);
  
  loanStatus = LoanStatus;

  dataSource: UsersDataSource | null;
  displayedColumns = ['checkbox', 'photo', 'fullName', 'email', 'phone', 'appliedLoan'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  categories: string[];
  selectedCategory: string;

  dialogRef : any;

  constructor( private userService: UserService, private snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit() {
      
    this.categories = [
        'all',
        'loaned'
    ];

    this.dataSource = new UsersDataSource(this.userService, this.paginator, this.sort);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
            .debounceTime(150)
            .distinctUntilChanged()
            .subscribe(() => {
                if ( !this.dataSource ) {
                    return;
                }
                this.dataSource.filter = this.filter.nativeElement.value;
            });
  }

  filterByCategory(category: string) {
    this.dataSource.category = this.selectedCategory = category;

    setTimeout(() => {
      if (!this.dataSource.filteredData || !this.dataSource.filteredData.length) {
          this.selection.clear();
      }
    });
  }

  isAllSelected(): boolean {
    if (!this.dataSource) { 
        return false; 
    }
    
    if (this.selection.isEmpty()) { 
        return false; 
    }

    if (this.filter.nativeElement.value) {
      return this.selection.selected.length === this.dataSource.filteredData.length;
    } else {
      return this.selection.selected.length === this.dataSource.filteredData.length;
    }
  }

  masterToggle() {
    if (!this.dataSource) { 
        return; 
    }

    if (this.isAllSelected()) {
      this.selection.clear();
    } else if (this.filter.nativeElement.value) {
      this.dataSource.filteredData.forEach(data => this.selection.select(data));
    } else {
      this.dataSource.filteredData.forEach(data => this.selection.select(data));
    }
  }

  unBlockSelected() {
    //   this.selection.selected.forEach(user => {
    //       this.userService.unBlockUser(user).then(() => {
    //         this.selection.clear();
    //         this.snackBar.open('Operation completed.', null,  {duration: 500});
    //       });
    //   });
  }

  deleteSelected() {
    this.selection.selected.forEach(user => {
        // this.userService.deleteUser(user).then(() => {
        //     this.selection.clear();
        //     this.snackBar.open('Operation completed.', null,  {duration: 500});
        // });
    });
  }

  onReviewApplication(user){

  }

  toggleStar(userId)
  {
    console.log(userId);
  }

}

export class UsersDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  _filteredDataChange = new BehaviorSubject('');
  _categoryChange = new BehaviorSubject('');

  get filteredData(): any {
      return this._filteredDataChange.value;
  }

  set filteredData(value: any) {
      this._filteredDataChange.next(value);
  }

  get filter(): string {
      return this._filterChange.value;
  }

  set filter(filter: string) {
      this._filterChange.next(filter);
  }

  get category(): string {
    return this._categoryChange.value;
  }

  set category(category: string) {
      this._categoryChange.next(category);
  }

  constructor(
      private userService: UserService,
      private _paginator: MatPaginator,
      private _sort: MatSort
  ) {
      super();
      this.filteredData = this.userService.coreUsers;
  }

  connect(): Observable<any[]> {
      const displayDataChanges = [
          this.userService.onUsersChanged,
          this._paginator.page,
          this._filterChange,
          this._sort.sortChange,
          this._categoryChange
      ];

      return Observable.merge(...displayDataChanges).map(() => {
          let data = this.userService.coreUsers.slice();
         
          data = this.filterDataByCategory(data, this.category);

          data = this.filterData(data);

          this.filteredData = [...data];

          data = this.sortData(data);

          // Grab the page's slice of data.
          const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
          return data.splice(startIndex, this._paginator.pageSize);
      });
  }

  filterData(data) {
      if ( !this.filter ) {
          return data;
      }
      return FuseUtils.filterArrayByString(data, this.filter);
  }

  filterDataByCategory(data: any[], category: string) {
    if (!this.category || this.category === 'all') {
        return data;
    }

    return data.filter(item => item.appliedLoan === true);
  }

  sortData(data): any[] {

    if ( !this._sort.active || this._sort.direction === '' )
    {
        return data;
    }

    return data.sort((a, b) => {
        let propertyA: number | string = '';
        let propertyB: number | string = '';

        switch ( this._sort.active )
        {
            case 'fullName':
                [propertyA, propertyB] = [a.fullName, b.fullName];
                break;
            case 'phone':
                [propertyA, propertyB] = [a.phone, b.phone];
                break;
            case 'email':
                [propertyA, propertyB] = [a.email, b.email];
                break;
            case 'appliedLoan':
                [propertyA, propertyB] = [a.appliedLoan, b.appliedLoan];
                break;
        }

        const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

        return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }

  disconnect() {
  }
}
