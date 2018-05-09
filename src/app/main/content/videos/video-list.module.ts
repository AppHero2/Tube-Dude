import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { CdkTableModule } from '@angular/cdk/table';

import { VideoListComponent } from './video-list.component';
import { VideoListService } from './video-list.service';

import { VideoComponent } from './video/video.component';
import { VideoService } from './video/video.service';

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

const routes = [
                {
                    path     : '',
                    component: VideoListComponent,
                    resolve  : {
                        data: VideoListService
                    }
                },
                {
                    path     : ':id',
                    component: VideoComponent,
                    resolve  : {
                        data: VideoService
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
        MatDialogModule,

    ],
    declarations: [
        VideoListComponent,
        VideoComponent
    ],
    providers: [
        VideoListService,
        VideoService
    ],
    entryComponents: []
    })
    
export class VideoListModule
{

}
