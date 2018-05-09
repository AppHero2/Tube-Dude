import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AuthService } from '../content/login/auth.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';


@Component({
    selector   : 'fuse-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls  : ['./toolbar.component.scss']
})

export class FuseToolbarComponent
{
    userStatusOptions: any[];
    languages: any;
    selectedLanguage: any;
    showLoadingBar: boolean;
    horizontalNav: boolean;
    noNav: boolean;

    constructor(
        private router: Router,
        private sidebarService: FuseSidebarService,
        private authService: AuthService
    )
    {

        router.events.subscribe(
            (event) => {
                if ( event instanceof NavigationStart )
                {
                    this.showLoadingBar = true;
                }
                if ( event instanceof NavigationEnd )
                {
                    this.showLoadingBar = false;
                }
            });

    }

    toggleSidebarOpened(key)
    {
        this.sidebarService.getSidebar(key).toggleOpen();
    }

    signOut() {
        this.authService.signOut().then(() => {
            this.router.navigate(['/login']);
        });
    }
}
