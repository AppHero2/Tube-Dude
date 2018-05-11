import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

import { FuseContentComponent } from 'app/main/content/content.component';
import { OneVideoComponent } from './one-video/one-video.component';

import { MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatButtonModule, MatInputModule, MatStepperModule } from '@angular/material';

import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { OneVideoService } from './one-video/one-video.service';

@NgModule({
    declarations: [
        FuseContentComponent,
        OneVideoComponent
    ],
    imports     : [
        RouterModule,
        FuseSharedModule,

        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        MatButtonModule,
        MatInputModule,
        MatStepperModule,

        ChartsModule,
        NgxChartsModule,

        FuseSharedModule,
        FuseWidgetModule
    ],
    exports: [
        FuseContentComponent
    ],
    providers: [
        OneVideoService
    ]
})
export class FuseContentModule
{
}
