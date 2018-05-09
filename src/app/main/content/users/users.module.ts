import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { CdkTableModule } from '@angular/cdk/table';

import { 
  MatButtonModule, 
  MatChipsModule, 
  MatFormFieldModule, 
  MatIconModule, 
  MatInputModule, 
  MatPaginatorModule, 
  MatRippleModule, 
  MatSelectModule, 
  MatSnackBarModule,
  MatSortModule, 
  MatTableModule, 
  MatTabsModule, 
  MatCheckboxModule,
  MatMenuModule,
  MatToolbarModule,
  MatDialogModule} from '@angular/material';

import { UsersComponent } from './users.component';
import { UserService } from './user.service';

const routes = [
  {
      path     : '',
      component: UsersComponent,
      resolve  : {
        data: UserService
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    CdkTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatRippleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatDialogModule
  ],
  declarations: [
    UsersComponent
  ],
  providers: [
    UserService
  ],
  entryComponents: []
})
export class UsersModule { }
