import { Component } from '@angular/core';

import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

import { ServiceWorkerModule } from '@angular/service-worker';
import { SwPush } from '@angular/service-worker';
import { SwUpdate } from '@angular/service-worker';
import { OnInit } from '@angular/core';
import { MessagingService } from 'app/messaging.service';

@Component({
    selector   : 'fuse-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit
{

    readonly VAPID_PUBLIC_KEY = "BBkCzxGCZMVb-yxy-0FsKphSSBXHgOm354dPaqQyUmJj4kIx0PBOic5x38mOQ5iJsrfgQPysWGwa7-wZoAFH46E";

    constructor(
        private fuseNavigationService: FuseNavigationService,
        private fuseSplashScreen: FuseSplashScreenService,
        private swPush : SwPush,
        private swUpdate: SwUpdate,
        private msgService: MessagingService
    )
    {}

    ngOnInit(){
        this.msgService.getPermission()
        this.msgService.receiveMessage()
    }

    subscribeToUpdate(){
        if (this.swUpdate.isEnabled) {
            this.swUpdate.available.subscribe(() =>{
                if (confirm("New version available. Load New Version?")) {
                    window.location.reload();
                }
            })
        }   
    }

    subscribeToNotifications(){
        // this.swPush.requestSubscription({
        //     serverPublicKey: this.VAPID_PUBLIC_KEY
        // })
        // .then(sub => )
    }
}
