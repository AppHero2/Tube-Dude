import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { fuseConfig } from './fuse-config';

import { AppComponent } from './app.component';
import { FuseMainModule } from './main/main.module';
import { NotFoundModule } from './main/content/not-found/not-found.module';
import { LoginModule } from './main/content/login/login.module';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AuthGuardService } from './main/content/login/auth-guard.service';
import { environment } from 'environments/environment';
import { DBService } from 'app/services/db.service';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MessagingService } from 'app/messaging.service';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { OneVideoComponent } from './main/content/one-video/one-video.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'videos',
        pathMatch: 'full'
    },
    {
        path        : 'videos',
        canLoad: [AuthGuardService],
        loadChildren: './main/content/videos/video-list.module#VideoListModule'
    },
    {
        path        : 'one-video',
        canLoad: [AuthGuardService],
        component: OneVideoComponent
    },
    {
        path      : '**',
        redirectTo: '404'
    },
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, { useHash: true }),

        // Fuse Main and Shared modules
        FuseModule.forRoot(fuseConfig),
        FuseSharedModule,
        FuseMainModule,
        NotFoundModule,

        HttpClientModule,
        LoginModule,

        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireDatabaseModule,

        ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [
        AuthGuardService,
        DBService,
        MessagingService,
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
